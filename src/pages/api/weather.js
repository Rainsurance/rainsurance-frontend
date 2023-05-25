import historybasic from "../../lib/meteoblue";

export default async function handler(req, res) {
    const { query } = req;

    const lat = query.lat / process.env.COORD_MULTIPLIER;
    const long = query.long / process.env.COORD_MULTIPLIER;
    const startdate = query.startdate; //timestamp
    const enddate = query.enddate; //timestamp

    console.log(lat, long, startdate, enddate);

    // convert timestamp to date in format yyyy-mm-dd
    const startdateFormatted = new Date(startdate * 1000)
        .toISOString()
        .slice(0, 10);
    const enddateFormattted = new Date(enddate * 1000)
        .toISOString()
        .slice(0, 10);

    const response = await historybasic(lat, long, startdateFormatted, enddateFormattted);

    res.status(200).json({result: response.prec, error: response.error });
}
