import * as React from 'react';
import {Alert, Platform} from "react-native";
import WebView from 'react-native-webview';
import Injected from "../../../injected.json";
import WebViewBridge, {UiEventType} from "../../WebViewBridge";
import {NativeBaseProvider, Actionsheet, Text,Box,VStack,HStack,Button,FormControl} from "native-base";
import {useState,useEffect} from "react";
import {formatEther} from "../../core/utils";

/**
 * @property {number} chainId
 * @property {string} url
 */
class DappData {
}

function TxActionsheet(props){
    const {tx,oncConfirm,onCancel} = props;
    if (!tx){
        return (<></>);
    }
    console.log(props.isOpen);
    return (
        <Actionsheet isOpen={props.isOpen}>
            <Actionsheet.Content>
                <Box w="100%" h={300} px={4} justifyContent="center">
                    <Text
                        fontSize="16"
                        color="gray.500"
                        _dark={{
                            color: "gray.300",
                        }}
                    >
                        请认真核对账单信息
                    </Text>
                    <FormControl>
                        <FormControl.Label>from</FormControl.Label>
                        <Text fontSize="md" maxW="200" isTruncated>{tx.from}</Text>
                        <FormControl.Label>to</FormControl.Label>
                        <Text fontSize="md" maxW="200" isTruncated>{tx.to}</Text>
                        <FormControl.Label>value</FormControl.Label>
                        <Text fontSize="md" maxW="200" isTruncated>{formatEther(tx.value)}</Text>
                        <FormControl.Label>gasPrice</FormControl.Label>
                        <Text fontSize="md" maxW="200" isTruncated>{formatEther(tx.gasPrice)}</Text>
                    </FormControl>
                    <VStack space={4} mb={4} alignItems="center">
                        <HStack space={4} alignItems="center">
                            <Button onPress={oncConfirm}>确定</Button>
                            <Button onPress={onCancel}>取消</Button>
                        </HStack>
                    </VStack>
                </Box>
            </Actionsheet.Content>
        </Actionsheet>
    );
}

export default function Dapp(props) {
    useEffect(()=>{
        return ()=>{
            console.log("WillUnmount")
        }
    })
    const {chainId, uri} = props.route.params
    const [tx,setTx] = useState()
    const [txOpen,setTxOpen] = useState(false);
    const [uiEvent,setUiEvent] = useState();
    const [webViewBridge,setWebViewBridge] = useState(new WebViewBridge((evt)=>{
        // 显示账单详情
        switch (evt.type){
            case UiEventType.SHOW_TX:
                /**
                 * {
                 * "gasPrice": "0x3b9aca00",
                 * "signTx": "0x02f86e0319843b...",
                 * "to": "0x06467...",
                 * "value": "0x3b9aca00",
                 * "from":"0x123456..."
                 * }
                 */
                setUiEvent(evt)
                setTx(evt.data);
                setTxOpen(true);
                break;
        }
    }))
    // dapp列表发过来的消息
    const onMessage = (evt) => {
        // console.log(evt);
        webViewBridge.onMessage(evt.nativeEvent.data);
    }
    // android 需要使用自定义的WebView中的注入方法，防止出现某些异常
    if (Platform.OS === 'android') {
        return (
            <NativeBaseProvider>
                <WebView
                    ref={r => webViewBridge.setWebview(r)}
                    userAgent={"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"}
                    source={{uri: uri}}
                    injectedJavaScript={Injected.provider}
                    injectedJavaScriptOnLoadStart={Injected.MetaMask} // [自定义参数,页面开始加载注入内容] 按需加载
                    openSchemeUrlEnabled={false} // [自定义参数] 是否允许打开三方应用
                    injectedJavaScriptForMainFrameOnly={false}
                    injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
                    onMessage={onMessage}
                    onLoad={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        // 这里可以动态设置标题 nativeEvent.header;
                    }}
                    onError={event => console.log(event.nativeEvent)}
                    onLoadProgress={e=>console.log(e.nativeEvent.progress)}
                />
                <TxActionsheet isOpen={txOpen} tx={tx} oncConfirm={()=>{
                    if(uiEvent){
                        uiEvent.resolve();
                    }
                    setTxOpen(false);
                }} onCancel={()=>{
                    if(uiEvent){
                        uiEvent.reason(new Error("客户取消支付"));
                    }
                    setTxOpen(false);
                }}/>
            </NativeBaseProvider>
        );
    } else if (Platform.OS === 'ios') {
        return (
            <NativeBaseProvider>
                <WebView
                    ref={r => webViewBridge.setWebview(r)}
                    source={{uri: uri}}
                    userAgent={"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"}
                    injectedJavaScriptBeforeContentLoaded={Injected.MetaMask}
                    injectedJavaScript={Injected.provider}
                    injectedJavaScriptForMainFrameOnly={false}
                    injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
                    onMessage={onMessage}
                    onError={event => Alert.alert("应用加载失败", "应用加载失败，请稍后重试，或者联系我们，给您带来的不便请见谅")}
                />
            </NativeBaseProvider>
        );
    }
}
