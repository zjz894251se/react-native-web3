import {BigNumber, ethers} from "ethers";
import Web3 from "web3";
import ChainConfig from "../ChainConfig";

/**
 * @property {string} address
 * @property {BigNumber} balance
 * @property {number} chainId
 */
class Wallet {
}

/**
 * 创建钱包
 * @param {number} chainId
 * @returns {Promise<Wallet>}
 */
export const createWallet = (chainId) => {
    return new Promise((resolve, reject)=>{
        let cnf = ChainConfig[chainId];
        if (!cnf){
            reject(new Error("非法币种，暂不支持！"));
            return;
        }
        let wallet = ethers.Wallet.createRandom();
        resolve({
            chainId:chainId,
            balance:ethers.BigNumber.from("0"),
            address:wallet.address,
            privateKey:wallet.privateKey,
            mnemonic:wallet.mnemonic.phrase,
            publicKey:wallet.publicKey,
        });
    })
}
/**
 * @param {number} chainId
 * @param {string} mnemonic
 * @return {Promise<Wallet>}
 */
export const importWalletByMnemonic = (chainId,mnemonic)=>{
    return new Promise((resolve, reject)=> {
        if (!mnemonic) {
            reject(new Error("请正确填写助记词!"));
            return
        }
        let cnf = ChainConfig[chainId];
        if (!cnf){
            reject(new Error("非法币种，暂不支持！"));
            return;
        }
        let wallet;
        try{
            wallet = ethers.Wallet.fromMnemonic(mnemonic);
        }catch (err){
            reject(new Error("请正确填写助记词！"));
        }
        if (!wallet){
            return;
        }
        let wb3 = new Web3(new Web3.providers.HttpProvider(cnf.uri));
        wb3.eth.getBalance(wallet.address).then(balance=>{
            resolve({
                chainId:chainId,
                balance:balance,
                address:wallet.address,
                privateKey:wallet.privateKey,
                mnemonic:wallet.mnemonic.phrase,
                publicKey:wallet.publicKey,
            });
        }).then(err=>{
            reject(err);
        })
    });
}
/**
 * 刷新钱包的余额
 * @param {Wallet} wallet
 * @return {Promise<Wallet>}
 */
export const refreshWalletBalance = (wallet)=>{
    return new Promise((resolve, reject)=> {
        let cnf = ChainConfig[wallet.chainId];
        if (!cnf){
            reject(new Error("非法币种，暂不支持！"));
            return;
        }
        let wb3 = new Web3(new Web3.providers.HttpProvider(cnf.uri));
        wb3.eth.getBalance(wallet.address).then(balance=>{
            if (typeof balance == 'string'){
                wallet.balance = BigNumber.from(balance);
            }else{
                wallet.balance = balance;
            }
            resolve(wallet);
        }).catch(err=>reject(err));
    })
}
