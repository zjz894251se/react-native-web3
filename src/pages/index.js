import * as React from 'react';
import {Image, StyleSheet, useColorScheme} from "react-native";
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {SafeAreaView} from "react-native-safe-area-context";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";




import HomeScreen from "./home";
import DappScreen from "./dapp";
import NewsScreen from "./news";
import SettingScreen from "./setting";

const Tab = createBottomTabNavigator();

const TabIconStyle = StyleSheet.create({
    width: 28,
    height: 28,
});

export default function () {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    return (
            <SafeAreaView style={{flex: 1}}>
                <NavigationContainer theme={theme}>
                    <Tab.Navigator screenOptions={{headerShown: false}}>
                        <Tab.Screen name="资产" options={() => ({
                            tabBarIcon() {
                                return <Image style={TabIconStyle}
                                              source={require('../../static/icons/tab_home.png')}/>;
                            }
                        })} component={HomeScreen}/>
                        <Tab.Screen name="应用" options={() => ({
                            tabBarIcon() {
                                return <Image style={TabIconStyle}
                                              source={require('../../static/icons/tab_home.png')}/>;
                            },
                        })} component={DappScreen}/>
                        <Tab.Screen name="资讯" options={() => ({
                            tabBarIcon() {
                                return <Image style={TabIconStyle}
                                              source={require('../../static/icons/tab_home.png')}/>;
                            },
                        })} component={NewsScreen}/>
                        <Tab.Screen name="我的" options={() => ({
                            tabBarIcon() {
                                return <Image style={TabIconStyle}
                                              source={require('../../static/icons/tab_home.png')}/>;
                            },
                        })} component={SettingScreen}/>
                    </Tab.Navigator>
                </NavigationContainer>
            </SafeAreaView>
    );
}
