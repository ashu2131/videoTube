import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/videotube`)
    } catch (error) {
        console.error("db is not connected", error)
        
    }
}

export default connectDB()