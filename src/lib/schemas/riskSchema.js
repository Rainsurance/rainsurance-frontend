import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    placeId: {
        type: String,
    },
    name: {
        type: String,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    }
});

const riskSchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },
        riskId: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        days: {
            type: Number,
        },
        place: {
            type: placeSchema,
        },
        aph: {
            type: Number,
        },
        trigger: {
            type: Number,
        },
        exit: {
            type: Number,
        },
        aaay: {
            type: Number,
        },
        payoutPercentage: {
            type: Number,
        },
        responseAt: {
            type: Date,
        },

    },
    { timestamps: true }
);

const Risk =
    mongoose.models.Risk || mongoose.model("Risk", riskSchema);

export default Risk;