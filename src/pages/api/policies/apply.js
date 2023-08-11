import { ethers } from "ethers";
import { v4 } from "uuid";

import connectDB from "../../../lib/connectDB";
import Policy from "../../../lib/schemas/policySchema";
import Customer from "../../../lib/schemas/customerSchema";
import Risk from "../../../lib/schemas/riskSchema";
import { rainProductContract } from "../../../lib/rainProduct";
import { sendPolicyMail } from "../../../lib/aws-ses";

export default async function handler(req, res) {
    // POST /api/policies/apply
    // RainProduct applyForPolicy
    // inputs: policyHolder (address), premium (uint256), sumInsured (uint256), riskId (bytes32)
    // output: processId (bytes32)
    if (req.method === "POST") {
        var { premium, sumInsured, riskId, bundleId, customer } = req.body;

        console.log(premium, sumInsured, riskId, bundleId, customer);

        await connectDB();

        try {
            var customerDb = await Customer.findOne({ email: customer.email });
            if (!customerDb) {
                customerDb = new Customer({ ...customer, id: v4() });
                await customerDb.save();
            }
            console.log("customer", customerDb);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
            return;
        }
        
        try {
            var riskDb = await Risk.findOne({ riskId });
            if (!riskDb) {
                const errorMessage = "risk not found";
                console.log(errorMessage);
                res.status(500).json({ error: errorMessage });  
            }
            console.log("risk", riskDb);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
            return;
        }

        const premiumBigNumber = ethers.utils.parseUnits(premium.toString(), 6);
        const sumInsuredBigNumber = ethers.utils.parseUnits(sumInsured.toString(), 6);

        let processId = "";

        try {
            const tx = await rainProductContract.applyForPolicyWithBundle(
                customer.wallet,
                premiumBigNumber,
                sumInsuredBigNumber,
                riskId,
                bundleId
            );
            processId = tx.hash; //TODO: this is not the processId
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
        console.log("processId", processId);

        try {
            const newPolicy = new Policy({
                id: v4(),
                processId,
                risk: riskDb,
                bundleId: bundleId,
                customer: customerDb,
                walletAddress: customer.wallet,
                premium,
                sumInsured,
            });
            await newPolicy.save();
            console.log("newPolicy", newPolicy);

            await sendPolicyMail(newPolicy);

            res.status(200).json({ newPolicy });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }

    }
}
