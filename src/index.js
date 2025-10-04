import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";

dotenv.config();

const port = process.env.PORT
const app = express()

app.get("/", (req, res) => {
    res.status(200).json({id:1, name:"ashu"})
})


connectDB
.then(() => {
    app.listen(port, (err) => {
    console.log("your erver is running on PORT", port)
})

})
.catch((err) => {
    console.log('samthing went wrong', err)
})


