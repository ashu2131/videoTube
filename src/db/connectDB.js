import mongoose from "mongoose";
import dotenv from "dotenv"
import { db_name } from "../.constants.js";

dotenv.config({
    path:  ['.env.local', './.env']
});

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`)
    } catch (error) {
        console.error("db is not connected", process.env.MONGODB_URL,"ashu", error)
        process.exit(1)
        
    }
}

export default connectDB()