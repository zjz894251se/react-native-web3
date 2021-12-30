import AsyncStorage from '@react-native-async-storage/async-storage';
import store from "./store";
import {walletInit, walletRefresh} from "./store/action";
import {BigNumber} from "ethers";
import {refreshWalletBalance} from "./core";

export const StorageKeys = {
    WALLET_CONFIG : "@WALLET_CONFIG",// 钱包配置
}

/**
 * @param {Wallet} wallet
 */
function fixWalletBalance(wallet){
    if (typeof wallet.balance == "string"){
        wallet.balance = BigNumber.from(wallet.balance);
    } else if (typeof  wallet.balance == "object"){
        wallet.balance = BigNumber.from(wallet.balance.hex);
    }
}

export const InitWalletConfig = ()=>{
    AsyncStorage.getItem(StorageKeys.WALLET_CONFIG).then(val=>{
        if (val){
            let obj = JSON.parse(val);
            if (obj){
                // JSON序列化完成后BigNumber结构是{"type":"BigNumber","hex":"0x00"}
                // balance 需要重新转化为BigNumber
                if (obj.defaultWallet){
                    fixWalletBalance(obj.defaultWallet);
                }
                if (obj.wallets){
                    for(let w of obj.wallets){
                        fixWalletBalance(w);
                    }
                }else{
                    obj.wallets = [];
                }
                store.dispatch(walletInit(obj.wallets,obj.defaultWallet));
                // 分别刷新余额
                for (let w of obj.wallets){
                    refreshWalletBalance(w).then(wallet=>{
                        store.dispatch(walletRefresh(wallet));
                    }).catch(err=>{
                        console.log("余额刷新失败",err);
                    })
                }
            }
        }
    }).catch(err=>{
        console.log('AsyncStorage::InitWalletConfig->catch',err);
    })
}
/**
 * @param {Wallet[]} wallets
 * @param {Wallet} defaultWallet
 * @constructor
 */
export const SaveWalletConfig = (wallets,defaultWallet)=>{
    AsyncStorage.setItem(StorageKeys.WALLET_CONFIG,JSON.stringify({
        wallets,
        defaultWallet
    }))
}
