async function run() {

    const startDate = Number(args[0]);
    const endDate = Number(args[1]);
    const coordMultiplier = Number(args[4]);
    const precMultiplier = Number(args[5]);
    var lat = Number(args[2]) / coordMultiplier;
    var lng = Number(args[3]) / coordMultiplier;
    
    if (!secrets.apiKey) {
      throw Error();
    }
    
    console.log(lat, lng, startDate, endDate, coordMultiplier, precMultiplier);
    
    const startDateFormatted = new Date(startDate * 1000).toISOString().slice(0, 10);
    const endDateFormattted = new Date(endDate * 1000).toISOString().slice(0, 10);
    
    const response = await historybasic(lat, lng, startDateFormatted, endDateFormattted, secrets.apiKey);
    
    if (!response.error) {
        const prec = Math.round(response.precAvg * precMultiplier);
        const precDays = response.precDays;
        return Buffer.concat([Functions.encodeUint256(prec), Functions.encodeUint256(precDays)])
    } else {
        throw Error(response.error_message);
    }

}

async function historybasic(lat, lng, startDate, endDate, apiKey) {

    const response = await Functions.makeHttpRequest({
        url: `https://my.meteoblue.com/packages/historybasic-1h?lat=${lat}&lon=${lng}&startdate=${startDate}&enddate=${endDate}&format=json&apikey=${apiKey}`,
    });

    const precipitationArray = response.data.history_1h.precipitation;
    const days = precipitationArray.length / 24;

    return {precAvg: 10, precDays: days, precProbability: 0, error: false};
};

return run();
