/**
 * native消息管理器
 */
import {NativeEvent, NativeEventTypes} from "../declare";
import {WalletEvent, WalletTypes} from "../declare";
import {MetaMaskNative} from "./MetaMask";

/**
 * @property {MetaMaskNative} _metaMaskNative
 * @property {WebViewBridge} _webViewBridge
 */
export class NativeMessageMgr {
    /**
     * @param {WebViewBridge} webViewBridge
     */
    constructor(webViewBridge) {
        this._webViewBridge = webViewBridge;
    }

    /**
     * 发送事件
     * @param {WalletEvent} evt
     */
    postWalletEvent(evt) {
        if (this._webViewBridge){
            this._webViewBridge.postMessage(new NativeEvent(NativeEventTypes.WALLET,evt));
        }
    }
    /**
     * @param {NativeEvent|string} event
     */
    onMessage(event){
        if (typeof event == 'string'){
            event = JSON.parse(event);
        }
        switch (event.type) {
            case NativeEventTypes.WALLET:
                // 钱包事件
                /**
                 * @type {WalletEvent}
                 */
                const data = event.data;
                switch (data.wallet) {
                    case WalletTypes.METAMASK:
                        if (!this._metaMaskNative){
                            this._metaMaskNative = new MetaMaskNative(this);
                        }
                        this._metaMaskNative.dispatch(data);
                        break;
                }
                break;
        }
    }
}
