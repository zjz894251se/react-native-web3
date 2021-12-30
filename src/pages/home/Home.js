import * as React from 'react';
import {Button, Stack, Center, NativeBaseProvider, VStack, HStack, Box, Image, Text,ScrollView} from "native-base";
import ChainActionSheet from "../common/ChainActionSheet";
import {useRef, useState} from "react";
import {connect} from "react-redux";
import {formatEther} from "../../core/utils";
import {TouchableHighlight} from 'react-native';

const MODEL = {
    CREATE: 1,
    IMPORT: 2,
}

/**
 * 钱包卡片
 * @return {JSX.Element}
 */
function WalletCard(props){
    const {wallet,navigation} = props;
    if (!wallet){
        return <></>
    }
    return (
        <TouchableHighlight onPress={
            ()=>{
                navigation.push('WalletDetail',{
                    wallet
                })
            }
        }>
            <Box
                 h="32"
                 p={3}
                 w="100%"
                 rounded="md"
                 borderColor="coolGray.200"
                 bgColor="#fff"
                 borderWidth="1">
                <HStack space={1} alignItems="center">
                    <Image
                        size="lg"
                        alt="icon"
                        source={require("../../../static/coins/1.png")}
                    />
                    <VStack space={1}>
                        <Text fontSize="lg" maxW="200" isTruncated>{'balance:' + formatEther(wallet.balance)}</Text>
                        <Text fontSize="md" maxW="85%" isTruncated>{'address:' + wallet.address}</Text>
                    </VStack>
                </HStack>
            </Box>
        </TouchableHighlight>
    )
}

/**
 * 除默认钱包外的钱包列表卡片
 * @return {[]}
 */
function OtherCards(props){
    const {wallets,defaultWallet,navigation} = props;
    let items = [];
    if (wallets.length<=1){
        return (<></>);
    }
    for (let i in wallets){
        /**
         * @type {Wallet}
         */
        let w = wallets[i];
        // 只渲染非默认的
        if(w.address !== defaultWallet.address){
            items.push(<WalletCard wallet={w} navigation={navigation} key={i}/>)
        }
    }
    return items;
}

function Home(props) {
    const {navigation, wallets, dispatch,defaultWallet} = props;
    const [chainAdShow, setChainAdShow] = useState(false);
    const mode = useRef(0);
    const onImportWallet = () => {
        mode.current = MODEL.IMPORT
        setChainAdShow(true);
    }
    const onCreateWallet = () => {
        mode.current = MODEL.CREATE;
        setChainAdShow(true);
    }
    const onSelectChain = (chainId) => {
        if (!chainId){
            return;
        }
        setChainAdShow(false);
        switch (mode.current) {
            case MODEL.CREATE:
                navigation.push("CreateWallet", {
                    chainId
                });
                break;
            case MODEL.IMPORT:
                navigation.push("ImportWallet", {
                    chainId
                });
                break;
        }
    }
    return (
        <NativeBaseProvider>
            <ScrollView>
                <VStack space={4} mb={4} alignItems="center" p={3}>
                    <WalletCard wallet={defaultWallet} navigation={navigation}/>
                    <OtherCards wallets={wallets} defaultWallet={defaultWallet} navigation={navigation}/>
                    <HStack space={4} alignItems="center">
                        <Button onPress={onImportWallet}>导入钱包</Button>
                        <Button onPress={onCreateWallet}>新建钱包</Button>
                    </HStack>
                </VStack>
            </ScrollView>
            <ChainActionSheet isOpen={chainAdShow} onSelect={onSelectChain}/>
        </NativeBaseProvider>
    );
}

const mapStateToProps = state => ({
    wallets: state.wallets,
    defaultWallet:state.defaultWallet
})

export default connect(mapStateToProps)(Home);
