import RainProductAbi from "../utils/RainProduct.json";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_URL
);

const signer = new ethers.Wallet(
    process.env.INSURER_PRIVATE_KEY,
    provider
);

const rainProductContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_RAIN_PRODUCT_ADDRESS,
    RainProductAbi,
    signer
);


export default rainProductContract;
