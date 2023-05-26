const pluralize = require("pluralize");

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const PolicyConditions = ({place, days, startDate, endDate, amount, aph}) => {
    return (
        <>
            <p>
                You will be entitled to a refund if the average{" "}
                precipitation within the range of 10km of {place}{" "}
                is greater than the amount stated above for at least {days}{" "}
                {pluralize("consecutive day", Number(days))} from{" "}
                {new Date(startDate).toLocaleDateString()} to{" "}
                {new Date(endDate).toLocaleDateString()}.
            </p>
            <p>
                You get {USDollar.format(amount)} (100% refund) if the{" "}
                rainfall is greater than or equal to 2x the value shown{" "}
                above ({2 * aph} mm).
                <br />
                You get a proportional refund if the amount is in between{" "}
                the two values.
            </p>
        </>
    );
}

export default PolicyConditions;
  