import {ethers} from "ethers";

/**
 * @param {BigNumber|string} wei
 * @return {string}
 */
export const formatEther = function (wei) {
    return ethers.utils.formatEther(wei)
}

/**
 * @param {string} ether
 * @return {BigNumber}
 */
export const parseEther = function (ether) {
    return ethers.utils.parseEther(ether);
}
/**
 * @param {string} hexString
 * @return {number|*}
 */
export const hexToInt = (hexString) => {
    if (hexString === undefined || hexString === null) {
        return hexString;
    }
    return Number.parseInt(hexString, 16);
}
/**
 * @param {number} int
 * @return {string|*}
 */
export const intToHex = (int) => {
    if (int === undefined || int === null) {
        return int;
    }
    let hexString = int.toString(16);
    return "0x" + hexString;
}
