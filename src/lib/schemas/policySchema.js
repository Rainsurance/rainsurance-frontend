import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },
        processId: {
            type: String,
        },
        riskId: {
            type: String,
        },
        customerId: {
            type: String,
        },
        userAddress: {
            type: String,
        },
        premium: {
            type: Number,
        },
        sumInsured: {
            type: Number,
        },
    },
    { timestamps: true }
);

const Policy =
    mongoose.models.policies || mongoose.model("policies", policySchema);

export default Policy;
