import rainProductContract from "../../../lib/rainProduct";

export default async function handler(req, res) {
    // POST /api/risks
    // RainProduct createRisk
    // inputs: placeId (bytes32), startDate (uint256), endDate (uint256), lat (int256), long (int256), trigger (uint256), exit (uint256), aph (uint256)
    // output: riskId (bytes32)
    if (req.method === "POST") {
        var { placeId, startDate, endDate, lat, lng, avgPrec } = req.body;

        const trigger = 0;
        const exit = 1;

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
                Number(process.env.RISK_TRIGGER) * percentageMultiplier,
                Number(process.env.RISK_EXIT) * percentageMultiplier,
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
