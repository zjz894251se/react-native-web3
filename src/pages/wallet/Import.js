import * as React from 'react';
import {NativeBaseProvider, Button, TextArea, FormControl, VStack, useToast} from "native-base";
import {importWalletByMnemonic} from "../../core";
import {useState} from "react";
import {connect} from "react-redux";
import {walletAdd} from "../../store/action";

const ImportButton = ({chainId,mnemonic,wallets,dispatch})=>{
    const toast = useToast()
    return (
        <Button onPress={()=>{
            importWalletByMnemonic(chainId,mnemonic).then(wallet=>{
                let findIdx = wallets.findIndex(w=>w.address === wallet.address);
                if (findIdx!==-1){
                    toast.show({
                        status: "warning",
                        title:"导入失败",
                        description: "该钱包已存在，请勿重复导入！",
                    })
                    return;
                }
                dispatch(walletAdd(wallet));
                toast.show({
                    status: "success",
                    title:"导入成功",
                    description: "钱包导入成功，请妥善保存助记词",
                })
            }).catch(err=>{
                console.log('importWalletByMnemonic error',err);
                toast.show({
                    status: "warning",
                    title:"导入失败",
                    description: "对不起，钱包导入失败，请稍后再试！",
                })
            })
        }} mt="5">导入到钱包</Button>
    )
}

const mapStateToProps = state => ({
    wallets: state.wallets
})

const ImportComponent = connect(mapStateToProps)(ImportButton);

export default function ImportWallet (props){
    const {chainId} = props.route.params
    const [mnemonic,setMnemonic] = useState("")
    return (
        <NativeBaseProvider>
            <VStack m={3}>
                <FormControl>
                    <FormControl.Label>助记词</FormControl.Label>
                    <TextArea value={mnemonic} onChangeText={txt=>setMnemonic(txt)} bgColor="#fff" placeholder="请输入助记词" h={20} w={{base:'100%'}}>
                    </TextArea>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        请仔细核对助记词
                    </FormControl.HelperText>
                </FormControl>
                <ImportComponent chainId={chainId} mnemonic={mnemonic}/>
            </VStack>
        </NativeBaseProvider>
    );
}
