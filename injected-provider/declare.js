/**
 * @property {number?} type
 * @property {any?} data
 */
export class  NativeEvent{
    constructor(type,data) {
        this.type = type;
        this.data = data;
    }
}

/**
 * Native 和 webview 交互事件类型
 * @type {{DAPP_OPEN: number, WALLET: number}}
 */
export const NativeEventTypes = {
    DAPP_OPEN:1,// 打开dapp
    WALLET:2, // 钱包
}

export const WalletTypes = {
    METAMASK:1,// 钱包类型
}

/**
 * @property {number} wallet
 * @property {number} type
 * @property {any} data
 */
export class WalletEvent{
    constructor(wallet) {
        this.wallet = wallet;
    }
}
