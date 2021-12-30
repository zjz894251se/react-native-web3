import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import News from "./News";

const NewsStack = createNativeStackNavigator();

export default class NewsScreen extends React.Component {
    render() {
        return (
            <NewsStack.Navigator>
                <NewsStack.Screen name="News" component={News} options={({route})=>({
                    title:"资讯"
                })}/>
            </NewsStack.Navigator>
        );
    }
}
