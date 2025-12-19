import mongoose, { MongooseError } from "mongoose";
import { MONGO_URI } from "../config.js";




export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to Database")
    } catch (error) {
        if (error instanceof MongooseError) {
            console.log("Error Connecting Database");
            throw new Error(error.message)
        }
    }
}