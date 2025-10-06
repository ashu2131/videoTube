import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({
  path: [".env.local", "./.env"],
});

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http//:localhost/3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// imports all routers
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/user", userRouter)


export { app };
