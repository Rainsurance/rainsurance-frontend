import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    placeSlug: {
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
        precDays: {
            type: Number,
        },
        place: {
            type: placeSchema,
        },
        precHist: {
            type: Number,
        },
        trigger: {
            type: Number,
        },
        exit: {
            type: Number,
        },
        precActual: {
            type: Number,
        },
        precDaysActual: {
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