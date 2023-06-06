import { v4 } from "uuid";
import connectDB from "../../../lib/connectDB";
import Risk from "../../../lib/schemas/riskSchema";
import { rainProductContract } from "../../../lib/rainProduct";

export default async function handler(req, res) {
    // POST /api/risks
    // RainProduct createRisk
    // inputs: placeId (bytes32), startDate (uint256), endDate (uint256), lat (int256), long (int256), trigger (uint256), exit (uint256), precHist (uint256)
    // output: riskId (bytes32)
    if (req.method === "POST") {
        var { place, startDate, endDate, days, lat, lng, avgPrec, precDays, riskId } = req.body;

        const trigger = 0;
        const exit = 1;

        await connectDB();

        try {
            var riskDb = await Risk.findOne({ riskId });
            if (!riskDb) {
                riskDb = new Risk({
                    id: v4(), 
                    riskId,
                    startDate,
                    endDate,
                    days,
                    place,
                    precDays,
                    precHist: avgPrec,
                    trigger,
                    exit,
                });
                await riskDb.save();
            }
            console.log("risk", riskDb);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
            return;
        } 

        try {
            // const coordinatesMultiplier = Number(
            //     await rainProductContract.getCoordinatesMultiplier()
            // );
            const coordinatesMultiplier =  Number(process.env.NEXT_PUBLIC_COORD_MULTIPLIER) 
            const precipitationMultiplier = Number(process.env.NEXT_PUBLIC_PRECIPITATION_MULTIPLIER)
            const percentageMultiplier = Number(
                await rainProductContract.getPercentageMultiplier()
            );

            const tx = await rainProductContract.createRisk(
                startDate / 1000,
                endDate / 1000,
                place.placeId,
                (lat * coordinatesMultiplier).toFixed(0),
                (lng * coordinatesMultiplier).toFixed(0),
                Number(process.env.RISK_TRIGGER) * percentageMultiplier,
                Number(process.env.RISK_EXIT) * percentageMultiplier,
                Math.round(avgPrec) * precipitationMultiplier
            );
            console.log(tx);
            res.status(200).json({ tx });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    }
}
