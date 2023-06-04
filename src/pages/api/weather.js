import historybasic from "../../lib/meteoblue";

export default async function handler(req, res) {
    const { query } = req;

    const lat = query.lat / process.env.NEXT_PUBLIC_COORD_MULTIPLIER;
    const long = query.long / process.env.NEXT_PUBLIC_COORD_MULTIPLIER;
    const startdate = query.startdate; //timestamp
    const enddate = query.enddate; //timestamp

    console.log(lat, long, startdate, enddate);

    // convert timestamp to date in format yyyy-mm-dd
    var tzoffset = (new Date()).getTimezoneOffset() * 60 * 1000; // offset in milliseconds
    const startdateFormatted = new Date(startdate * 1000 - tzoffset)
        .toISOString()
        .slice(0, 10);
    const enddateFormattted = new Date(enddate * 1000 - tzoffset)
        .toISOString()
        .slice(0, 10);

    const response = await historybasic(lat, long, startdateFormatted, enddateFormattted);
    console.log(response);

    const days = Math.round((enddate - startdate) / (24 * 60 * 60));
    const minRainDays = Math.ceil(days * Number(process.env.NEXT_PUBLIC_RISK_DAYS_PERCENTAGE));
    const precDays = response.precDays;
    
    const eligible = precDays >= minRainDays;
    console.log(days, minRainDays, precDays, eligible);

    res.status(200).json({result: response.prec, precDays, error: response.error });
}
