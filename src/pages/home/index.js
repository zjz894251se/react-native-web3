import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "./Home";

const HomeStack = createNativeStackNavigator();

import ImportWallet from "../wallet/Import";
import CreateWallet from "../wallet/Create";
import WalletDetail from "../wallet/Detail";

export default class HomeScree extends React.Component {
    render() {
        return (
            <HomeStack.Navigator>
                <HomeStack.Screen name="Home" component={Home} options={({route})=>({
                    title:"资产"
                })}/>
                <HomeStack.Screen name="ImportWallet" component={ImportWallet} options={({route})=>({
                    title:"导入钱包"
                })}/>
                <HomeStack.Screen name="CreateWallet" component={CreateWallet} options={({route})=>({
                    title:"新建钱包"
                })}/>
                <HomeStack.Screen name="WalletDetail" component={WalletDetail} options={({route})=>({
                    title:"钱包详情"
                })}/>
            </HomeStack.Navigator>
        );
    }
}
