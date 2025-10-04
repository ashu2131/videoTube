import express from "express"
import dotenv from "dotenv"

dotenv.config();

const port = process.env.PORT
const app = express()

app.get("/", (req, res) => {
    res.status(200).json({id:1, name:"ashu"})
})



app.listen(port, (err) => {
    console.log("your erver is running on PORT", port)
})

