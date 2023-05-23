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

    const requestUrl = `https://my.meteoblue.com/packages/historybasic-1h?lat=${lat}&lon=${long}&startdate=${startdateFormatted}&enddate=${enddateFormattted}&format=json&apikey=${process.env.METEOBLUE_API_KEY}`;

    console.log(`requestUrl: ${requestUrl}`);

    const response = await fetch(requestUrl);
    const data = await response.json();

    if (!data["error_message"]) {
        const historyArray = data["history_1h"];
        const precipitationArray = historyArray["precipitation"];
        const precipitationSum = precipitationArray.reduce((a, b) => a + b, 0);
        const days = precipitationArray.length / 24;
        const precipitationAvg = precipitationSum / days;
        const precipitationAvgRounded = Math.ceil(precipitationAvg);
        console.log(`precipitationAvg: ${precipitationAvg}`);
        console.log(`precipitationAvgRounded: ${precipitationAvgRounded}`);

        res.status(200).json({ result: precipitationAvgRounded, error: false });
    } else {
        res.status(200).json({
            result: 0,
            error: true,
            error_message: data["error_message"],
        });
    }
}
