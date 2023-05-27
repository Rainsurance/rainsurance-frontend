const historybasic = async (lat, long, startdate, enddate) => {

    const requestUrl = `https://my.meteoblue.com/packages/historybasic-1h?lat=${lat}&lon=${long}&startdate=${startdate}&enddate=${enddate}&format=json&apikey=${process.env.METEOBLUE_API_KEY}`;
    console.log(`requestUrl: ${requestUrl}`);

    const response = await fetch(requestUrl);
    const data = await response.json();

    if (!data["error_message"]) {
        const chunkSize = 24;
        const historyArray = data["history_1h"];
        const precipitationArray = historyArray["precipitation"];
        const precipitationSum = precipitationArray.reduce((a, b) => a + b, 0);
        const days = precipitationArray.length / chunkSize;
        const precipitationAvg = precipitationSum / days;
        const precipitationAvgRounded = Math.ceil(precipitationAvg);
        // console.log(`precAvg: ${precipitationAvg}`);
        // console.log(`precAvgRounded: ${precipitationAvgRounded}`);
        
        //We need to calculate the probability of precipitation since Meteoblue does not provide this information
        const precipitationArrayChunks = [];
        for (let i = 0; i < precipitationArray.length; i += chunkSize) {
            const chunk = precipitationArray.slice(i, i + chunkSize);
            precipitationArrayChunks.push(chunk);
        }
        let rainyDays = 0;
        precipitationArrayChunks.forEach(day => {
            const dailyRain = day.reduce((a, b) => a + b, 0);
            if (dailyRain > 0) {
                rainyDays++;
            }
        });
        const precProbability = rainyDays / days;
        // console.log(`precProbability: ${precProbability}`);

        return {prec: precipitationAvgRounded, precProbability, error: false};
    } else {
        return {prec: 0, precProbability: 0, error: true,  error_message: data["error_message"]};
    }

};

export default historybasic;