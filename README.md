# react-native-web3

测试一下React Native 运行web3

## 注意事项
nodejs要使用14.xxx<br>
尽可能使用npm来运行,yarn某些情况会出错<br>
注意metro.config.js文件里面的修改<br>
react-native-webview 要使用我改造过的，否则有些情况下注入会有问题 [react-native-webview](https://github.com/zjz894251se/react-native-webview.git) <br>
## 免责声明

本项目仅仅作为个人业余研究用途，切勿商用或者做违反当地法律的用途，如果产生不良后果，责任自负。

## 本地搭建流程

```bat
react-native init xxx
npm i --save node-libs-browser react-native-crypto react-native-randombytes
react-native link 
npm i --save-dev tradle/rn-nodeify
./node_modules/.bin/rn-nodeify --hack --install
npm i --save web3
```

## 开源协议

[MIT](http://opensource.org/licenses/MIT)
