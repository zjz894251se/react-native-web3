export const ChainId = {
    EthereumMainnet:1,//主节点
    EthereumRopsten:3,//Ropste 测试网络
}

/**
 * 导出币节点列表
 * 先能支持eth,bsc,heco
 */
export default {
    [ChainId.EthereumMainnet] : {
        name:"Ethereum Mainnet",
        uri:"https://mainnet.infura.io/v3/223669f868794fd9a43dc17c129b9b3a",
        icon:require("../static/coins/1.png")
    },
    [ChainId.EthereumRopsten] : {
        name:"Ethereum Ropsten",
        uri:"https://ropsten.infura.io/v3/223669f868794fd9a43dc17c129b9b3a",
        icon:require("../static/coins/1.png")
    },
}
