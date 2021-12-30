import {ActionTypes} from "./action";
import {SaveWalletConfig} from "../Storage";

const InitState = {
    wallets:[],
    defaultWallet:null,
}

export function todoWallet(state=InitState,action){
    switch (action.type){
        case ActionTypes.WALLET_INIT:
            // 初始化,这里从缓存中拿
            return Object.assign({},{
                defaultWallet:action.defaultWallet,
                wallets:action.wallets
            });
        case ActionTypes.WALLET_ADD:
            // 如果初始没有默认钱包，那么就使用第一个元素即可
            if (!state.defaultWallet){
                let newObj = Object.assign({},state,{
                    defaultWallet:action.wallet,
                    wallets:[...state.wallets,action.wallet]
                });
                SaveWalletConfig(newObj.wallets,newObj.defaultWallet)
                return newObj;
            }
            // 增
            SaveWalletConfig([...state.wallets,action.wallet],state.defaultWallet);
            return Object.assign({},state,{
                wallets:[...state.wallets,action.wallet]
            })
        case ActionTypes.WALLET_DEFAULT:
            SaveWalletConfig(state.wallets,action.wallet);
            // 设置默认钱包
            return Object.assign({},state,{
                defaultWallet:action.wallet
            })
        case ActionTypes.WALLET_REFRESH:
            let defaultWallet = state.defaultWallet;
            if (action.wallet.address === state.defaultWallet.address){
                defaultWallet = action.wallet;
            }
            let wallets = [...state.wallets];
            let idx = wallets.findIndex(w=>w.address === action.wallet.address);
            if (idx!==-1){
                wallets[idx] = action.wallet;
            }
            SaveWalletConfig(wallets,defaultWallet);
            return Object.assign({},state,{
                defaultWallet,wallets,
            })
    }
    return state;
}
