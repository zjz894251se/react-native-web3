export const ChainId = {
    EthereumMainnet:1,//主节点
    EthereumRopsten:3,//Ropste 测试网络
}

/**
 * 导出币节点列表
 */
export default {
    [ChainId.EthereumMainnet] : {
        name:"Ethereum Mainnet",
        uri:"https://mainnet.infura.io/v3/{YOUER_KEY}",
        icon:require("../static/coins/1.png")
    },
    [ChainId.EthereumRopsten] : {
        name:"Ethereum Ropsten",
        uri:"https://ropsten.infura.io/v3/{YOUER_KEY}",
        icon:require("../static/coins/1.png")
    },
}
