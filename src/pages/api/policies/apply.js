import { ethers } from "ethers";
import { v4 } from "uuid";

import connectDB from "../../../lib/connectDB";
import Policy from "../../../lib/schemas/policySchema";
import Customer from "../../../lib/schemas/customerSchema";
import rainProductContract from "../../../lib/rainProduct";

export default async function handler(req, res) {
    // POST /api/policies/apply
    // RainProduct applyForPolicy
    // inputs: policyHolder (address), premium (uint256), sumInsured (uint256), riskId (bytes32)
    // output: processId (bytes32)
    if (req.method === "POST") {
        var { premium, sumInsured, riskId, customer } = req.body;

        console.log(premium, sumInsured, riskId, customer);

        await connectDB();

        const premiumBigNumber = ethers.parseUnits(premium, 6);
        const sumInsuredBigNumber = ethers.parseUnits(sumInsured, 6);

        let processId = "";
        try {
            const tx = await rainProductContract.applyForPolicy(
                customer.wallet,
                premiumBigNumber,
                sumInsuredBigNumber,
                riskId
            );
            processId = tx.hash; //TODO: this is not the processId
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
        console.log("processId", processId);

        try {
            var customerDb = await Customer.findOne({ email: customer.email });
            if (!customerDb) {
                customerDb = new Customer({ ...customer, id: v4() });
                await customerDb.save();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
        console.log("customer", customerDb);

        try {
            const newPolicy = new Policy({
                id: v4(),
                processId,
                riskId,
                customerId: customerDb.id,
                premium,
                sumInsured,
            });
            await newPolicy.save();
            res.status(200).json({ newPolicy });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    }
}
