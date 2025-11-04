import mongoose from "mongoose";

const connectDB = () => {
    try {
    mongoose.connect(`${process.env.MONGO_URI}`)
    console.log("Successfully connected to the database.")
} catch (error) {
    console.log(`The database connection failed: ${error}`)
    
}
    
}
export default connectDB