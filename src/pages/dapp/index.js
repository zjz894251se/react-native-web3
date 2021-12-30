import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DappList from "./DappList";
import Dapp from "./Dapp";

const DappStack = createNativeStackNavigator();

export default class DappScreen extends React.Component{
    render() {
        return (
            <DappStack.Navigator>
                <DappStack.Screen
                    name="DappList"
                    component={DappList} options={({route})=>({
                    title:"应用"
                })}/>
                <DappStack.Screen
                    name="Dapp"
                    component={Dapp}
                    options={({ route }) => ({
                        title: route.params.name
                    })}
                />
            </DappStack.Navigator>
        );
    }
}
