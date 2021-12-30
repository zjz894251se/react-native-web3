import * as React from 'react';

import {Image, NativeBaseProvider, VStack,Text,HStack,Button} from 'native-base';
import {formatEther} from "../../core/utils";
import store from "../../store";
import {walletDefault} from "../../store/action";

/**
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export default function Detail(props) {
    const {wallet} = props.route.params;
    return (
        <NativeBaseProvider>
            <VStack space={4} mb={4} alignItems="center" p={3}>
                <Image
                    size="lg"
                    alt="icon"
                    source={require("../../../static/coins/1.png")}
                />
                <Text fontSize="lg" maxW="200" isTruncated>{formatEther(wallet.balance)}</Text>
                <Text fontSize="md" maxW="85%" isTruncated>{wallet.address}</Text>
                <HStack space={4} alignItems="center">
                    <Button onPress={
                        ()=>{
                            store.dispatch(walletDefault(wallet))
                        }
                    }>设置为默认</Button>
                </HStack>
            </VStack>
        </NativeBaseProvider>
    );
}
