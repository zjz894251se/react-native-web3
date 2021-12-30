import * as React from 'react';
import {NativeBaseProvider, Button, TextArea, FormControl, VStack, useToast} from "native-base";
import Clipboard from '@react-native-clipboard/clipboard';
import {useState} from "react";
import {connect} from "react-redux";
import {createWallet} from "../../core";
import {walletAdd} from "../../store/action";

const CopyButton = (props) => {
    const toast = useToast()
    return (
        <Button
            mt="5"
            onPress={() => {
                if (!props.mnemonic || props.mnemonic.length < 1) {
                    toast.show({
                        status: "warning",
                        title:"复制失败",
                        description: "请先创建好钱包再复制助记词！",
                    })
                } else {
                    Clipboard.setString(props.mnemonic);
                    Clipboard.getString().then(cStr => {
                        if (cStr !== props.mnemonic) {
                            toast.show({
                                status: "warning",
                                title:"复制失败",
                                description: "对不起，复制失败，请确保权限正常！",
                            })
                        } else {
                            toast.show({
                                status: "success",
                                title:"复制成功",
                                description: "复制成功，请粘贴到安全的地方以确保助记词安全！",
                            })
                        }
                    }).catch(err => {
                        toast.show({
                            status: "warning",
                            title:"复制失败",
                            description: "对不起，复制失败，请确保权限正常！",
                        })
                    })
                }
            }
            }
        >
            复制助记词
        </Button>
    )
}

const CreateButton = ({onSuccess,chainId})=>{
    const toast = useToast()
    return (
        <Button onPress={()=>{
            createWallet(chainId).then(wallet=>{
                toast.show({
                    status: "success",
                    title:"创建成功",
                    description: "钱包创建成功，请妥善保存助记词",
                })
                onSuccess(wallet);
            }).catch(err=>{
                toast.show({
                    status: "warning",
                    title:"创建失败",
                    description: "对不起，钱包创建失败，请稍后再试！",
                })
            })
        }} mt="5">新建钱包</Button>
    )
}

function CreateWallet(props) {
    const {navigation, wallets, dispatch,defaultWallet} = props;
    const [mnemonic, setMnemonic] = useState("");
    const {chainId} = props.route.params
    function onCreateSuccess(wallet) {
        setMnemonic(wallet.mnemonic);
        dispatch(walletAdd(wallet));
    }
    return (
        <NativeBaseProvider>
            <VStack m={3}>
                <FormControl>
                    <FormControl.Label>助记词</FormControl.Label>
                    <TextArea bgColor="#fff" value={mnemonic} onChangeText={txt=>setMnemonic(txt)} placeholder="请输入助记词" h={20} w={{base: '100%'}}>
                    </TextArea>
                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                        请务必保存好助记词.
                    </FormControl.HelperText>
                </FormControl>
                <CreateButton onSuccess={onCreateSuccess} chainId={chainId}/>
                <CopyButton mnemonic={mnemonic}/>
            </VStack>
        </NativeBaseProvider>
    );
}

const mapStateToProps = state => ({
    wallets: state.wallets
})

export default connect(mapStateToProps)(CreateWallet);
