import { ethers } from "ethers";
import slugify from "react-slugify";

export function formatDate(timestamp) {
    return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

export function isFutureDate(timestamp) {
    return timestamp * 1000 > new Date().getTime();
}

export function b2s(input) {
    //return ethers.decodeBytes32String(input); //v5
    return ethers.utils.parseBytes32String(input); //v6
}

export function s2b(input) {
    //return ethers.encodeBytes32String(slugify(input)); //ethers v6
    return ethers.utils.formatBytes32String(slugify(input)); //ethers v5
}