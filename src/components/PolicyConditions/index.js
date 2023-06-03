const pluralize = require("pluralize");

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const PolicyConditions = ({place, days, startDate, endDate, amount, precHist}) => {
    const rainyDays = Math.ceil(days * Number(process.env.NEXT_PUBLIC_RISK_DAYS_PERCENTAGE));
    return (
        <>
            <p>
                You will be entitled to a refund if the average daily{" "}
                precipitation within the range of 10km of {place}{" "}
                is greater than the volume stated above for at least {rainyDays}{" "}
                {pluralize("day", rainyDays)} between{" "}
                {new Date(startDate).toLocaleDateString()} and{" "}
                {new Date(endDate).toLocaleDateString()}.
            </p>
            <p>
                You get {USDollar.format(amount)} (100% refund) if the{" "}
                rainfall volume is greater than or equal to 2x the value{" "}
                shown above ({2 * precHist} mm).
                <br />
                You get a proportional refund if the rainfall volume is in{" "} 
                between the two values.
            </p>
        </>
    );
}

export default PolicyConditions;
  