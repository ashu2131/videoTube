import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import app from "./app.js";

// Load environment variables first
dotenv.config({ path: "./.env" });

// Connect to Database
connectDB()
const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });