import RainProductAbi from "../../../utils/RainProduct.json";
import { ethers } from "ethers";

export default async function handler(req, res) {
    // POST /api/policies/apply
    // RainProduct applyForPolicy
    // inputs: policyHolder (address), premium (uint256), sumInsured (uint256), riskId (bytes32)
    // output: processId (bytes32)
    if (req.method === "POST") {
        var { policyHolder, premium, sumInsured, riskId } = req.body;

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

        const premiumBigNumber = ethers.parseUnits(premium, 6);
        const sumInsuredBigNumber = ethers.parseUnits(sumInsured, 6);

        try {
            const tx = await rainProductContract.applyForPolicy(
                policyHolder,
                premiumBigNumber,
                sumInsuredBigNumber,
                riskId
            );
            console.log(tx);
            res.status(200).json({ tx });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    }
}
