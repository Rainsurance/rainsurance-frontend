import historybasic from "../../../lib/meteoblue";

var Statistics = require("statistics.js");

export default async function handler(req, res) {
    var { startDate, endDate, days, amount, lat, lng } = req.body;

    console.log(startDate, endDate, days, amount, lat, lng);

    const dayMiliseconds =  24 * 60 * 60 * 1000;
    const weekMiliseconds = 7 * dayMiliseconds;

    const weeks = Math.ceil(Math.ceil(days / 7));

    startDate = startDate - weeks * weekMiliseconds / 2;
    endDate = endDate + weeks * weekMiliseconds / 2;
    const limit = Math.ceil((endDate - startDate) / dayMiliseconds);

    let simulation = [];

    if(process.env.SIMULATION_PROVIDER == "meteum") {

        startDate = new Date(startDate);
        const startOfYear = new Date(startDate.getFullYear(), 0, 1);
        const diffTime = Math.abs(startDate - startOfYear);
        const offset = Math.ceil(diffTime / dayMiliseconds);
    
        const query = `
            query {
                weatherByPoint(request: { lat: ${lat}, lon: ${lng} }) {
                    climate {
                        days(limit: ${limit}, offset: ${offset}) {
                            prec
                            precProbability
                        }
                    }
                }
            }
        `;
        console.log("meteum query: ", query);
    
        const response = await fetch("https://api.meteum.ai/graphql/query", {
            method: "POST",
            headers: {
                "X-Meteum-API-Key": process.env.METEUM_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });
        const data = await response.json();
    
        if (data.errors) {
            console.log(data.errors);
            res.status(500).json({ error: data.errors });
        } else {
            const { days: climatesDays } = data.data.weatherByPoint.climate;
            simulation = climatesDays;
            console.log("meteum simulation: ", simulation);
        }
    }

    if(process.env.SIMULATION_PROVIDER == "meteoblue") {

        let pastStartDate = startDate;
        let pastEndDate = endDate;
        
        for (let i = 1; i <= Number(process.env.METEOBLUE_YEARS); i++) {
            pastStartDate = startDate - (i * dayMiliseconds * 365)
            pastEndDate = endDate - (i * dayMiliseconds * 365)
            // convert timestamp to date in format yyyy-mm-dd
            const startdateFormattted = new Date(pastStartDate).toISOString().slice(0, 10);
            const enddateFormattted = new Date(pastEndDate).toISOString().slice(0, 10);
            
            try {
                simulation.push(await historybasic(lat, lng, startdateFormattted, enddateFormattted));
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: error });
            }
        }
        console.log("metoblue simulation: ", simulation);
    }

    const prec = simulation.reduce((acc, item) => {
        return acc + item.prec;
      }, 0);
    const avgPrec = prec / simulation.length;

    const probability = simulation.reduce((acc, item) => {
        return acc + item.precProbability;
      }, 0);
    const dailyPrecProb = probability / simulation.length;

    // Conhecendo a probabilidade de chover em 1 dia (dailyPrecProb), qual a probabilidade de chover X ou mais dias no intervalo selecionado pelo usuário?
    // X = Dias selecionados pelo usuário * NEXT_PUBLIC_RISK_DAYS_PERCENTAGE
    // Ou ao invés de deixar fixo, podemos deixar o usuário escolher X no frontend
    // TODO: devemos salvar o valor de X na apólice no smart contract
    // Distribuição Binominal
    // Ref: https://www.ime.usp.br/~salles/fatec/estatistica/material_apoio/ExerciciosResolvidosBinomial.pdf
    // Ref: https://thisancog.github.io/statistics.js/inc/distributions.html#binomialdistribution
    
    const n = Number(days);
    const k = Math.ceil(days * Number(process.env.NEXT_PUBLIC_RISK_DAYS_PERCENTAGE));
   
    // dailyPrecProb = probability of rain in 1 day
    // 50% probability of more volume of rain (in mm) than the daily average volume (?) - I believe this is true for a normal distribution
    const p = dailyPrecProb * 0.5;

    const stats = new Statistics(simulation.slice(0, n)); // we need to instanciate the Statistics with data.length = n for it to work
    const binProbDistribution = stats.binomialDistribution(n, p);

    //sum the probability of k or more days of rain
    let binProb = 0;
    for (let i = k; i <= n; i++) {
        binProb += binProbDistribution[i];
    }

    const premium = amount * binProb * (1 + Number(process.env.FEE_PERCENTAGE)) + Number(process.env.FEE_FIXED_DEFAULT);

    const response = {
        avgPrec: avgPrec.toFixed(1),
        dailyPrecProb,
        probability: binProb,
        precDays: k,
        stats: {
            n, k, p, distribution: binProbDistribution 
        },
        premium: premium.toFixed(2),
    }
    
    console.log(response);

    res.status(200).json(response);

}
