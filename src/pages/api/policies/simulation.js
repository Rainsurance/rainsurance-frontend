export default async function handler(req, res) {
    var { startDate, days, amount, lat, lng } = req.body;

    console.log(startDate, days, amount, lat, lng);

    startDate = new Date(startDate);
    const startOfYear = new Date(startDate.getFullYear(), 0, 1);
    const diffTime = Math.abs(startDate - startOfYear);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const query = `
        query {
            weatherByPoint(request: { lat: ${lat}, lon: ${lng} }) {
                climate {
                    days(limit: ${days}, offset: ${diffDays}) {
                        maxDayTemperature
                        minNightTemperature
                        prec
                        precStrength
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
        res.status(500).json({ error: data.errors });
    } else {
        const { days } = data.data.weatherByPoint.climate;
        const prec = days.reduce((acc, item) => acc + item.prec, 0);
        const avgPrec = prec / days.length;
        const probability = days.reduce(
            (acc, item) => acc * item.precProbability,
            1
        );
        const premium = amount * probability * 1.1;

        res.status(200).json({
            avgPrec: avgPrec.toFixed(1),
            probability,
            premium: premium.toFixed(2),
        });
    }
}
