import rainProductContract from "../../../lib/rainProduct";

export default async function handler(req, res) {
    // POST /api/policies/claim
    // RainProduct processPolicy(bytes32 policyId)
    // inputs: policyId (bytes32)
    if (req.method === "POST") {
        var { policyId } = req.body;

        try {
            const tx = await rainProductContract.processPolicy(policyId);
            console.log(tx);
            res.status(200).json({ tx });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    }
}
