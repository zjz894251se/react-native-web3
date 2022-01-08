import {NativeEventTypes} from "../injected-provider/NativeEvent";
import {NativeMessageMgr} from "../injected-provider/native";

export const UiEventType = {
    SHOW_TX: 1,//显示交易信息
}

/**
 * @property {number} type
 * @property {any} data
 */
export class UiEvent {
    /**
     * @param {number?} type
     * @param {any?} data
     */
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
    resolve(result){
        if(this.thenFunc){
            this.thenFunc(result);
        }
    }
    reason(err){
        if(this.catchFunc){
            this.catchFunc(err);
        }
    }
    /**
     * @param {function(any):UiEvent} thenFunc
     */
    then(thenFunc){
        this.thenFunc = thenFunc;
        return this;
    }
    /**
     * @param {function(any):UiEvent} catchFunc
     */
    catch(catchFunc){
        this.catchFunc = catchFunc;
        return this;
    }
}

/**
 * @property {UiEvent} webview
 * @property {NativeMessageMgr} nativeMessageMgr
 */
export default class WebViewBridge {
    /**
     * @param {function(UiEvent)} onUiEvent 某些事务需要UI确认操作，在这里定义
     */
    constructor(onUiEvent = undefined) {
        this.onUiEvent = onUiEvent;
        this.nativeMessageMgr = new NativeMessageMgr(this);
    }

    setWebview(webView) {
        this.webview = webView
    }

    setNavigation(n) {
        this.navigation = n;
    }

    postMessage(message) {
        if (typeof message == "object") {
            message = JSON.stringify(message);
        }
        // console.log("[send to web]", message);
        if (this.webview) {
            // console.log("has webview")
            this.webview.postMessage(message);
        }else{
            // console.log("not has webview")
        }
    }

    /**
     * 接收消息
     * @param {NativeEvent|string} message
     */
    onMessage(message){
        // console.log("WebViewBridge::onMessage",message);
        if (typeof message == 'string'){
            message = JSON.parse(message);
        }
        if (message.type === NativeEventTypes.DAPP_OPEN){
            console.log('打开dapp');
            this.navigation.push("Dapp", message.data);
        }else{
            this.nativeMessageMgr.onMessage(message);
        }
    }
    /**
     * 下面得是之前web3的，目前弃用
     */
    //
    // /**
    //  * @param {CrossEvent} evt
    //  */
    // onEvent(evt) {
    //     if (typeof evt == 'string') {
    //         evt = JSON.parse(evt);
    //     }
    //     console.log("WebViewBridge::onEvent", evt);
    //     switch (evt.type) {
    //         case CrossEventType.OPEN_DAPP:
    //             // 打开dapp
    //             console.log('打开dapp');
    //             this.navigation.push("Dapp", evt.data)
    //             break;
    //         case CrossEventType.PROVIDER:
    //             // provider传递过来的数据
    //             //{"id": 1640523946737, "jsonrpc": "2.0", "method": "eth_chainId", "params": []}
    //             const {method, params} = evt.data;
    //             /**
    //              * 这里就是dapp和app交互的核心逻辑，根据method判断用户意图
    //              */
    //             const state = store.getState();
    //             /**
    //              * @type {Wallet}
    //              */
    //             const defaultWallet = state.defaultWallet;
    //             let cnf = ChainConfig[defaultWallet.chainId];
    //             /**
    //              * @type {Wallet[]}
    //              */
    //             const wallets = state.wallets;
    //             switch (method) {
    //                 case "eth_chainId":
    //                     this.postMessage(new CrossEvent(evt.type, evt.id, {
    //                         resolve: intToHex(defaultWallet.chainId)
    //                     }));
    //                     break;
    //                 case "eth_accounts":
    //                     let accounts = [];
    //                     for (let w of wallets) {
    //                         accounts.push(w.address);
    //                     }
    //                     this.postMessage(new CrossEvent(evt.type, evt.id, {
    //                         resolve: accounts
    //                     }));
    //                     break;
    //                 case "eth_getBalance":
    //                     // 这里注意，web3会把地址转为小写，
    //                     let balance = '0';
    //                     let findWallet = wallets.find(w => w.address.toLowerCase() === params[0].toLowerCase());
    //                     if (findWallet) {
    //                         balance = findWallet.balance.toString();
    //                     }
    //                     this.postMessage(new CrossEvent(evt.type, evt.id, {
    //                         resolve: balance
    //                     }));
    //                     break;
    //                 case "eth_sendTransaction":
    //                     // 为签名交易创建一个新的消息调用交易或合约。
    //                     // 这里也可以让客户选择账户，按需求做吧
    //                     console.log(cnf.uri);
    //                     let provider = new ethers.providers.Web3Provider(
    //                         new web3.providers.HttpProvider(cnf.uri)
    //                     )
    //                     let wallet = new ethers.Wallet(defaultWallet.privateKey);
    //
    //                     let onlineWallet = wallet.connect(provider);
    //                     let tx = params[0];
    //                     if (tx.gas) {
    //                         delete tx.gas;
    //                     }
    //                     if (tx.from) {
    //                         delete tx.from;
    //                     }
    //
    //                     onlineWallet.populateTransaction(tx).then(pTx => {
    //                         onlineWallet.signTransaction(pTx).then(signTx => {
    //                             // eth_sendRawTransaction
    //                             // 发送签名后的消息
    //                             // {"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["{signTx}"],"id":1}
    //                             let sendData = Object.assign({}, evt.data, {
    //                                 method: 'eth_sendRawTransaction',
    //                                 params: [signTx]
    //                             })
    //                             /**
    //                              * 结果
    //                              * {"id": 1640827795251, "jsonrpc": "2.0", "result": "0xe..."}
    //                              */
    //                             let txUiData = Object.assign({},tx,{
    //                                 signTx:signTx,
    //                                 from:defaultWallet.address
    //                             });
    //                             console.log(txUiData);
    //                             if(this.onUiEvent){
    //                                 let event = new UiEvent(UiEventType.SHOW_TX,txUiData).then((result)=>{
    //                                     console.log("客户确认发送订单");
    //                                     // 客户确认了，发送出去
    //                                     // 结果是交易哈希，如果交易未生效则返回全0哈希。
    //                                     this._sendFetch(cnf,Object.assign({},evt,{
    //                                         data:sendData
    //                                     }))
    //                                 }).catch(err=>{
    //                                     this.postMessage(new CrossEvent(evt.type, evt.id, {
    //                                         reason: "客户取消订单"
    //                                     }));
    //                                     console.log("客户取消订单");
    //                                 })
    //                                 this.onUiEvent(event);
    //                             }
    //                         }).catch(err => {
    //                             console.log('signTx::err', err.message);
    //                         })
    //                     }).catch(err => {
    //                         console.log('pTx::err', err.message);
    //                     });
    //                     break;
    //                 case "eth_getTransactionReceipt":
    //                     // 返回指定交易的收据，使用哈希指定交易。
    //                     // 如果收据不存在则为null
    //                     this._sendFetch(cnf, evt);
    //                     break;
    //                 default:
    //                     this._sendFetch(cnf, evt);
    //                     break;
    //             }
    //     }
    // }
    //
    // /**
    //  * 直接发送出去
    //  * @private
    //  */
    // _sendFetch(chainCnf, evt) {
    //     this._fetch(chainCnf,evt).then(result=>{
    //         this.postMessage(new CrossEvent(evt.type, evt.id, {
    //             resolve: result
    //         }));
    //     }).catch(err=>{
    //         this.postMessage(new CrossEvent(evt.type, evt.id, {
    //             reason: typeof err == 'object' ? (err.message ? err.message : err.getMessage()) : err
    //         }));
    //     })
    // }
    //
    // // 请求
    // _fetch(chainCnf, evt) {
    //     return new Promise((resolve, reason) => {
    //         fetch(chainCnf.uri, {
    //             method: 'POST',
    //             headers: {
    //                 "Accept": "application/json",
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(evt.data)
    //         }).then(response => {
    //             if (response.status === 200) {
    //                 response.json().then(result => {
    //                     console.log("json", result);
    //                     if (result.error) {
    //                         reason(result.error)
    //                     } else {
    //                         resolve(result.result)
    //                     }
    //                 }).catch(err => {
    //                     console.log("json", err);
    //                     reason(new Error("response msg is not json"))
    //                 });
    //             } else {
    //                 reason(new Error("rpc server response status: " + response.status));
    //             }
    //         }).catch(failed => {
    //             console.log(failed);
    //             reason(failed)
    //         })
    //     })
    // }
}
