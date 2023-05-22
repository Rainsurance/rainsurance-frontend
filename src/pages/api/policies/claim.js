import RainProductAbi from "../../../utils/RainProduct.json";
import { ethers } from "ethers";

export default async function handler(req, res) {
    // POST /api/policies/claim
    // RainProduct processPolicy(bytes32 policyId)
    // inputs: policyId (bytes32)
    if (req.method === "POST") {
        var { policyId } = req.body;

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

        try {
            const tx = await rainProductContract.processPolicy(policyId);
            console.log(tx);
            res.status(200).json({ tx });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    }
}
