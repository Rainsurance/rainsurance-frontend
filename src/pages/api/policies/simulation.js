import historybasic from "../../../lib/meteoblue";

export default async function handler(req, res) {
    var { startDate, endDate, days, amount, lat, lng } = req.body;

    console.log(startDate, endDate, days, amount, lat, lng);

    let simulation = [];

    const dayMiliseconds =  24 * 60 * 60 * 1000;
    const weekMiliseconds = 7 * dayMiliseconds;

    const weeks = Math.ceil(Math.ceil(days / 7));

    startDate = startDate - weeks * weekMiliseconds / 2;
    endDate = endDate + weeks * weekMiliseconds / 2;
    days = Math.ceil((endDate - startDate) / dayMiliseconds);

    if(process.env.SIMULATION_PROVIDER == "meteum") {

        startDate = new Date(startDate);
        const startOfYear = new Date(startDate.getFullYear(), 0, 1);
        const diffTime = Math.abs(startDate - startOfYear);
        const offset = Math.ceil(diffTime / dayMiliseconds);
    
        const query = `
            query {
                weatherByPoint(request: { lat: ${lat}, lon: ${lng} }) {
                    climate {
                        days(limit: ${days}, offset: ${offset}) {
                            prec
                            precProbability
                        }
                    }
                }
            }
        `;
    
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
            const { days } = data.data.weatherByPoint.climate;
            console.log(days);
            simulation = days;
        }
    }

    if(process.env.SIMULATION_PROVIDER == "meteoblue") {

        const years = 10;
        let pastStartDate = startDate;
        let pastEndDate = endDate;
        let history = [];
        for (let i = 1; i <= years; i++) {
            pastStartDate = startDate - (i * dayMiliseconds * 365)
            pastEndDate = endDate - (i * dayMiliseconds * 365)
            // convert timestamp to date in format yyyy-mm-dd
            const startdateFormattted = new Date(pastStartDate).toISOString().slice(0, 10);
            const enddateFormattted = new Date(pastEndDate).toISOString().slice(0, 10);
            
            try {
                history.push(await historybasic(lat, lng, startdateFormattted, enddateFormattted));
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: error });
            }
        }

        console.log(history);
        simulation = history;

    }

    const prec = simulation.reduce((acc, item) => {
        return acc + item.prec;
      }, 0);
    const avgPrec = prec / simulation.length;

    const probability = simulation.reduce((acc, item) => {
        return acc + item.precProbability;
      }, 0);
    const avgProbability = probability / simulation.length;

    const premium = amount * avgProbability * (1 + Number(process.env.FEE_PERCENTAGE)) + Number(process.env.FEE_FIXED_DEFAULT);

    //TODO: conhecendo a probabilidade de chuva em 1 dia (avgProbability), qual a probabilidade de chover X dias no intervalo indicado pelo usuário?
    // X pode ser igual a uma quantidade de dias fixa (Ex: 30% dos dias dentro do intervalo)
    // Ou posso deixar o usuário escolher X no frontend
    // Essa mecânica não está prevista no Smart Contract
    // Ref: https://www.ime.usp.br/~salles/fatec/estatistica/material_apoio/ExerciciosResolvidosBinomial.pdf

    const response = {
        avgPrec: avgPrec.toFixed(1),
        probability: avgProbability,
        premium: premium.toFixed(2),
    }
    
    console.log(response);

    res.status(200).json(response);

}
