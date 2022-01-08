import {CoinTypes} from "./wallet";

/**
 * 钱包网络配置
 */
export const CoinNetworks = {
    // 先使用ropsten测试
    [CoinTypes.ETH]:{
        chainId:3,
        uri:'https://ropsten.infura.io/v3/223669f868794fd9a43dc17c129b9b3a',
    },
    // 主节点
    // [CoinTypes.ETH]:{
    //     chainId:1,
    //     uri:'https://mainnet.infura.io/v3/223669f868794fd9a43dc17c129b9b3a',
    // },
    // 币安链 https://www.binancezh.cc/zh-CN
    // doc https://binance-docs.github.io/apidocs/spot/cn/#185368440e
    // 钱包api https://docs.binance.org/smart-chain/wallet/wallet_api.html
    // sdk https://github.com/binance-chain/javascript-sdk/tree/master/docs
    /**
     * https://docs.binance.org/smart-chain/wallet/metamask.html
     * https://docs.binance.org/smart-chain/developer/rpc.html
     * Testnet
     * https://bsc-dataseed.binance.org/
     * https://bsc-dataseed1.defibit.io/
     * https://bsc-dataseed1.ninicoin.io/
     * ChainID: 0x61, 97 in decimal (if 97 doesn’t work, try 0x61)
     * Symbol: BNB
     * Block Explorer: https://testnet.bscscan.com
     *
     * Mainnet
     * https://bsc-dataseed.binance.org/
     * https://bsc-dataseed1.defibit.io/
     * https://bsc-dataseed1.ninicoin.io/
     * ChainID: 0x38, 56 in decimal (if 56 doesn’t work, try 0x38)
     * Symbol: BNB
     * Block Explorer: https://bscscan.com
     * 水龙头
     * https://testnet.binance.org/faucet-smart
     *
     * Binance Smart Chain
     * https://bsc-dataseed.binance.org
     * BNB
     * https://bscscan.com
     */
    [CoinTypes.BSC]:{
        chainId:97,
        uri:'https://testnet.bscscan.com',
    },
    /**
     * https://scan.hecochain.com/
     * https://docs.hecochain.com/#/mainnet
     */
    [CoinTypes.HECO]:{
        chainId:128,
        uri:"https://http-mainnet.hecochain.com"
    }
}

export const getChainConfig = function (walletType) {
    switch (walletType){

    }
}
