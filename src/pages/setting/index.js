import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import My from "./My";

const SettingStack = createNativeStackNavigator();

export default class SettingScreen extends React.Component {
    render() {
        return (
            <SettingStack.Navigator>
                <SettingStack.Screen name="Setting" component={My} options={({route})=>({
                    title:"我的"
                })}/>
            </SettingStack.Navigator>
        );
    }
}
