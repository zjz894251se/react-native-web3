/**
 * Hex    Decimal    Network
 * 0x1    1    Ethereum Main Network (Mainnet)
 * 0x3    3    Ropsten Test Network
 * 0x4    4    Rinkeby Test Network
 * 0x5    5    Goerli Test Network
 * 0x2a   42   Kovan Test Network
 */
import {JsonRpcRequest, MetaMaskEvent, MetaMaskEventTypes, MetaMaskResponseData} from "../../wallets/MetaMask/declare";
import web3 from "web3";
import {ethers} from "ethers";

/**
 * @property {NativeMessageMgr} _nativeMessageMgr
 * @property {ethers.Wallet} _wallet
 * @property {ethers.providers.Web3Provider} _provider
 */
export class MetaMaskNative {
    get _wallet(){
        // 这个初始化需要提前进行，会耗时
        if (!this.__wallet){
            let wallet = ethers.Wallet.fromMnemonic("they make lumber claw health brass drastic light arrest grape fix that");
            this.__wallet = wallet.connect(this._provider);
        }
        return this.__wallet;
    }
    constructor(nativeMessageMgr) {
        // 初始化的时候发送connect事件
        this._nativeMessageMgr = nativeMessageMgr;
        let web3Provider = new web3.providers.HttpProvider('https://ropsten.infura.io/v3/223669f868794fd9a43dc17c129b9b3a');
        this._provider = new ethers.providers.Web3Provider(web3Provider);
    }

    /**
     * 投递事件
     * @param {MetaMaskEventData} data
     */
    postEvent(data) {
        if (this._nativeMessageMgr) {
            this._nativeMessageMgr.postWalletEvent(new MetaMaskEvent(MetaMaskEventTypes.EVENT, data));
        }
    }

    /**
     * @param {MetaMaskResponseData} response
     */
    postResponse(response) {
        if (this._nativeMessageMgr) {
            this._nativeMessageMgr.postWalletEvent(new MetaMaskEvent(MetaMaskEventTypes.REQUEST, response));
        }
    }

    /**
     * @param {MetaMaskEvent} event
     */
    dispatch(event) {
        // console.log("MetaMask::dispatch",event);
        switch (event.type) {
            case MetaMaskEventTypes.EVENT:
                // 事件，其实这里应该没啥需要处理的，主要还是得web端处理
                break;
            case MetaMaskEventTypes.REQUEST:
                // 请求
                this.onRequest(event.data);
                break;
        }
    }

    /**
     * @param {JsonRpcRequest} args
     * @return {Promise<Response>}
     * @private
     */
    _request(args){
        return new Promise((resolve,reject)=>{
            fetch('https://ropsten.infura.io/v3/223669f868794fd9a43dc17c129b9b3a', {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(args)
            }).then(response=>{
                if (response.status === 200) {
                    response.json().then(result => {
                        console.log("_request->json",result);
                        if (result.error) {
                            reject(result.error)
                        } else {
                            resolve(result.result)
                        }
                    }).catch(err => {
                        console.log("_request->json error",err);
                        reject(new Error("response msg is not json"))
                    });
                } else {
                    console.log("_request->status",response.status);
                    reject(new Error("rpc server response status: " + response.status));
                }
            }).catch(err=>{
                console.log("_request->catch",err);
                reject(err);
            })
        })
    }

    /**
     * @param {MetaMaskResponseData} response
     * @param {JsonRpcRequest} jsonRequest
     */
    doRequest(response,jsonRequest){
        this._request(jsonRequest).then(json=>{
            response.resolve = json;
            this.postResponse(response);
        }).catch(err=>{
            response.reject = err;
            this.postResponse(response);
        })
    }
    /**
     * @param {JsonRpcRequest} jsonRequest
     */
    onRequest(jsonRequest) {
        console.log(jsonRequest.method)
        let response = new MetaMaskResponseData();
        response.id = jsonRequest.id;
        switch (jsonRequest.method) {
            case 'eth_accounts':
                // [***这里需要根据app钱包来动态返回***]
                response.resolve = ['0x4723ba3cdef4485D4671Ac34e6d88791dE927b12'];
                this.postResponse(response);
                break;
            case 'eth_requestAccounts':
                // [***这里需要根据app钱包来动态返回***]
                response.resolve = ['0x4723ba3cdef4485D4671Ac34e6d88791dE927b12'];
                this.postResponse(response);
                break;
            case 'eth_chainId':
                // [***这里需要根据app钱包来动态返回***]
                response.resolve = '0x3';
                this.postResponse(response);
                break;
            case 'eth_sign':
                // 签名消息
                this._wallet.signMessage(jsonRequest.params[1]).then(hex=>{
                    response.resolve = [hex];
                    this.postResponse(response);
                }).catch(err=>{
                    response.reject = err;
                    this.postResponse(response);
                })
                break;
            case 'eth_signTransaction':
            {
                // 签名交易
                let tx = Object.assign({},jsonRequest.params[0]);
                if (tx.gas) {
                    delete tx.gas;
                }
                if (tx.from) {
                    delete tx.from;
                }
                this._wallet.populateTransaction(tx).then(pTx=>{
                    console.log("梳理数据成功",pTx);
                    this._wallet.signTransaction(pTx).then(signTx=>{
                        console.log("签名结束",signTx);
                        response.resolve = [signTx];
                        // 发送签名出去
                        this.postResponse(response);
                    }).catch(err=>{
                        console.log("签名错误",err);
                        response.reject = err;
                        this.postResponse(response);
                    })
                }).catch(err=>{
                    console.log("梳理数据失败",err);
                    response.reject = err;
                    this.postResponse(response);
                })
            }
                break;
            case 'eth_sendTransaction':
            {
                console.log("测试环境，自动进行支付,正式环境弹出确认窗口或者而密码输入窗口，让客户确认");
                console.log("开始签名...")
                /**
                 * @type {ethers.providers.TransactionRequest}
                 */
                let tx = Object.assign({},jsonRequest.params[0]);
                if (tx.gas) {
                    delete tx.gas;
                }
                if (tx.from) {
                    delete tx.from;
                }
                console.log("梳理数据");
                this._wallet.populateTransaction(tx).then(pTx=>{
                    console.log("梳理数据成功",pTx);
                    this._wallet.signTransaction(pTx).then(signTx=>{
                        console.log("签名结束",signTx);
                        let request = new JsonRpcRequest();
                        request.id = jsonRequest.id;
                        request.params = [signTx];
                        request.method = 'eth_sendRawTransaction';
                        this.onRequest(request);
                    }).catch(err=>{
                        console.log("签名错误",err);
                        response.reject = err;
                        this.postResponse(response);
                    })
                }).catch(err=>{
                    console.log("梳理数据失败",err);
                    response.reject = err;
                    this.postResponse(response);
                })
            }
                break;
            default:
                // 其余的默认直接发送请求
                this.doRequest(response,jsonRequest);
        }
    }
}

/**
 *
 * eth_call
 *
 * eth_estimateGas
 *
 * {\"method\":\"eth_estimateGas\",
 * \"params\":[{\"value\":\"0x16345785d8a0000\",\"from\":\"0x4723ba3cdef4485d4671ac34e6d88791de927b12\",\"to\":\"0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45\",\"data\":\"0x5ae401dc0000000000000000000000000000000000000000000000000000000061d7d60c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000003cdf0c7b4adcc300000000000000000000000000000000000000000000000000000000000000800000000000000000000000004723ba3cdef4485d4671ac34e6d88791de927b120000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c778417e063141139fce010982780140aa0cd5ab0000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f98400000000000000000000000000000000000000000000000000000000\"}],
 * \"jsonrpc\":\"2.0\",\"id\":17}}}
 * 执行并估算一个交易需要的gas用量。该次交易不会写入区块链。注意，由于多种原因，例如EVM的机制 及节点旳性能，估算的数值可能比实际用量大的多。
 *
 * eth_sendTransaction
 *
 * {"id": 15, "jsonrpc": "2.0", "method": "eth_sendTransaction",
 * "params": [{"data": "0x5ae401dc0000000000000000000000000000000000000000000000000000000061d7d9f800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000003cdf0c7b4adcc300000000000000000000000000000000000000000000000000000000000000800000000000000000000000004723ba3cdef4485d4671ac34e6d88791de927b120000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c778417e063141139fce010982780140aa0cd5ab0000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f98400000000000000000000000000000000000000000000000000000000",
 * "from": "0x4723ba3cdef4485d4671ac34e6d88791de927b12",
 * "gas": "0x28a26",
 * "to": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
 * "value": "0x16345785d8a0000"}]}
 *
 * 测试环境，自动进行支付,正式环境弹出确认窗口或者而密码输入窗口，让客户确认
 *
 *
 * eth_sendRawTransaction
 *
 * 发送转账请求
 *
 * eth_getTransactionByHash
 *
 * 返回指定哈希对应的交易
 *
 *
 * eth_getTransactionReceipt
 *
 * 返回指定交易的收据，使用哈希指定交易。
 * 需要指出的是，挂起的交易其收据无效。
 *
 * {"id": 27,
 * "jsonrpc": "2.0",
 * "result": {
 *  "blockHash": "0x926bff99fa16ef765bd5800acca4f59e11a44f95c994d053ec005d02dc4b77d1",
 *  "blockNumber": "0xb3948a",
 *  "contractAddress": null,
 *  "cumulativeGasUsed": "0x39d9c1",
 *  "effectiveGasPrice": "0x9502f90a",
 *  "from": "0x4723ba3cdef4485d4671ac34e6d88791de927b12",
 *  "gasUsed": "0x1bd2e",
 *  "logs": [[Object], [Object], [Object], [Object], [Object]],
 *  "logsBloom": "0x00200000000000000000000080000000800000004000000000000020000000000000000000000000000000000000001000000000000000000000000000000000440000000000000000000008100000200000000000210000000000008000000008000000000200000000000000000000000000000000000000000010000000000000000000000000000800000000002000000001000000080000004000010000000000000000000000000000000000000000000000000000000000000000000000000002000000010000000000000000000000000000001000000100000000000000000000000000000000000000080000002000000000400000000000000000",
 *  "status": "0x1",
 *  "to": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
 *  "transactionHash": "0x432b18a1add78a02d952ef142566852c0c0d6cc28bca4bd80b313bca3921dbf6",
 *  "transactionIndex": "0x5",
 *  "type": "0x2"
 *  }
 * }
 *
 */
