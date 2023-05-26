import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },
        processId: {
            type: String,
        },
        customer :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        risk :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Risk'
        },
        walletAddress: {
            type: String,
        },
        premium: {
            type: Number,
        },
        sumInsured: {
            type: Number,
        }
    },
    { timestamps: true }
);

const Policy =
    mongoose.models.Policy || mongoose.model("Policy", policySchema);

export default Policy;
