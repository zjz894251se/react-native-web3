/**
 * 钱包类型配置
 * 根据钱包类型决定使用哪个钱包的实现
 */
export const WalletTypes = {
    METAMASK: 1,
}
/**
 * 币类型，根据币类型到config里面获取网络配置
 */
export const CoinTypes = {
    ETH:1,
    BSC:2,
    HECO:3,
}

/**
 * 钱包信息
 * @property {number} chainId
 * @property {number} type (WalletTypes)
 * @property {number} coinType (CoinTypes)
 * @property {WalletAccount[]} accounts
 */
export class Wallet {
}

/**
 * 钱包账户
 * @property {string} address           账户地址
 * @property {BigNumber} balance        当前缓存的金额
 * @property {number} chainId
 * @property {WalletToken[]} tokens     代币列表
 * @property {string} privateKey        私钥
 * @property {string} mnemonic          助记词
 * @property {boolean} default          是否默认账户
 */
export class WalletAccount{
}

/**
 * 钱包账单，这个有待考量，看是保存还是到scan网络获取
 */
export class WalletOrder{
}

/**
 * 代币token
 * @property {string} address  合约地址
 * @property {string} name  合约名称
 * @property {string} symbol 单位名称($)
 * @property {number} decimals 单位切分数量 （18）
 */
export class WalletToken {
}
