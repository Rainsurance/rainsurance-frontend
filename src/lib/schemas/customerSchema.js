import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },
        name: {
            type: String,
        },
        doc: {
            type: String,
        },
        email: {
            type: String,
        },
        wallet: {
            type: String,
        },
    },
    { timestamps: true }
);

const Customer =
    mongoose.models.customers || mongoose.model("customers", customerSchema);

export default Customer;
