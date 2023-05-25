import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        //console.log("Already connected.");
        return;
    }

    mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
