export const ActionTypes = {
    // 初始化钱包
    WALLET_INIT: "WALLET_INIT",
    // 增加钱包
    WALLET_ADD: "WALLET_ADD",
    // 设置默认钱包
    WALLET_DEFAULT:"WALLET_DEFAULT",
    // 修改钱包
    WALLET_REFRESH:"WALLET_REFRESH",
}

/**
 * @param {Wallet[]} wallets
 * @param {Wallet} defaultWallet
 * @return {{type: string}}
 */
export const walletInit = (wallets,defaultWallet) => {
    return {
        type: ActionTypes.WALLET_INIT,
        wallets,
        defaultWallet
    }
}

export const walletAdd = (wallet)=>{
    return {
        type: ActionTypes.WALLET_ADD,
        wallet,
    }
}

export const walletDefault = (wallet)=>{
    return {
        type: ActionTypes.WALLET_DEFAULT,
        wallet,
    }
}

export const walletRefresh = (wallet)=>{
    return {
        type: ActionTypes.WALLET_REFRESH,
        wallet,
    }
}
