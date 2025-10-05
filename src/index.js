import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";
import {app} from "./app.js"
const port = process.env.PORT
dotenv.config({
    path:  ['.env.local', './.env']
});




connectDB
.then(() => {
    app.listen(port || 3000, (err) => {
    console.log("your ⚙ Server is 🏃‍♀️running on PORT", port)
})

})
.catch((err) => {
    console.log('samthing went wrong', err)
})


