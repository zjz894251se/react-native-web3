/**
 * @format
 */
import 'react-native-get-random-values'
import "./globals";
import {AppRegistry} from 'react-native';
import App from './src/pages';
import {name as appName} from './app.json';
import React from "react";

import store from './src/store';
import {Provider} from "react-redux";
import {InitWalletConfig} from "./src/Storage";

AppRegistry.registerComponent(appName, () => () => {
    InitWalletConfig();
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    )
});
