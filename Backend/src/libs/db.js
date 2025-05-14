import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const con = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${con.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB Error:", error);
        process.exit(1); // Exit if database connection fails
    }
};
