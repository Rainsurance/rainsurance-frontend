import RainProductAbi from "../utils/RainProductCLFunctions.json";
import RainOracleAbi from "../utils/RainOracleCLFunctions.json";
import CLFunctionsOracleAbi from "../utils/CLFunctionsOracle.json";
import CLFunctionsBillingRegistryAbi from "../utils/CLFunctionsBillingRegistry.json";
import { ethers } from "ethers";
import { erc20ABI } from "wagmi";

//v6
// const provider = new ethers.JsonRpcProvider(
//     process.env.NEXT_PUBLIC_INFURA_URL
// );

//v5
const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_URL
);

const insurer = new ethers.Wallet(
    process.env.INSURER_PRIVATE_KEY,
    provider
);

const instanceOperator = new ethers.Wallet(
    process.env.INSTANCE_OPERATOR_PRIVATE_KEY,
    provider
);

export const rainProductContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
    RainProductAbi,
    insurer
);

export const rainOracleContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_RAIN_ORACLE_ADDRESS,
    RainOracleAbi,
    insurer
);

export const oracle = new ethers.Contract(
    process.env.CHAINLINK_FUNCTIONS_ORACLE_ADDRESS,
    CLFunctionsOracleAbi,
    insurer
);

export const registry = new ethers.Contract(
    process.env.CHAINLINK_FUNCTIONS_REGISTRY_ADDRESS,
    CLFunctionsBillingRegistryAbi,
    insurer
);

export const token = new ethers.Contract(
    process.env.NEXT_PUBLIC_USDC_ADDRESS,
    erc20ABI,
    instanceOperator
);