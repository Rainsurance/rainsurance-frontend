import RainProductAbi from "../../../utils/RainProduct.json";
import { ethers } from "ethers";

export default async function handler(req, res) {
    // POST /api/risks
    // RainProduct createRisk
    // inputs: placeId (bytes32), startDate (uint256), endDate (uint256), lat (int256), long (int256), trigger (uint256), exit (uint256), aph (uint256)
    // output: riskId (bytes32)
    if (req.method === "POST") {
        var { placeId, startDate, endDate, lat, lng, avgPrec } = req.body;

        const trigger = 0;
        const exit = 1;

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
            const coordinatesMultiplier = Number(
                await rainProductContract.getCoordinatesMultiplier()
            );

            const percentageMultiplier = Number(
                await rainProductContract.getPercentageMultiplier()
            );

            const tx = await rainProductContract.createRisk(
                startDate / 1000,
                endDate / 1000,
                placeId,
                lat * coordinatesMultiplier,
                lng * coordinatesMultiplier,
                trigger * percentageMultiplier,
                exit * percentageMultiplier,
                Math.round(avgPrec)
            );
            console.log(tx);
            res.status(200).json({ tx });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    }
}
