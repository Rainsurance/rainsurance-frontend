import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },
        name: {
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
    mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
