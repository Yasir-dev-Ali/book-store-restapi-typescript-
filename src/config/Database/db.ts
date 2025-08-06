import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
           
        });
        console.log("MongoDB connected successfully !");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
