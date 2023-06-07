import RainProductAbi from "../utils/RainProductCLFunctions.json";
import RainOracleAbi from "../utils/RainOracleCLFunctions.json";
import CLFunctionsOracleAbi from "../utils/CLFunctionsOracle.json";
import CLFunctionsBillingRegistryAbi from "../utils/CLFunctionsBillingRegistry.json";
import { ethers } from "ethers";

//v6
// const provider = new ethers.JsonRpcProvider(
//     process.env.NEXT_PUBLIC_INFURA_URL
// );

//v5
const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_URL
);

const signer = new ethers.Wallet(
    process.env.INSURER_PRIVATE_KEY,
    provider
);

export const rainProductContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
    RainProductAbi,
    signer
);

export const rainOracleContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_RAIN_ORACLE_ADDRESS,
    RainOracleAbi,
    signer
);

export const oracle = new ethers.Contract(
    process.env.CHAINLINK_FUNCTIONS_ORACLE_ADDRESS,
    CLFunctionsOracleAbi,
    signer
);

export const registry = new ethers.Contract(
    process.env.CHAINLINK_FUNCTIONS_REGISTRY_ADDRESS,
    CLFunctionsBillingRegistryAbi,
    signer
);