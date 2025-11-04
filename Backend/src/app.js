import router from "./routes/auth.router.js"
import videoRouter from "./routes/video.router.js";
import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // only allow your React app
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.urlencoded({express:true}))
app.use(express.static("../public"))


app.use("/api/v1/user", router)
app.use("/api/v1/video", videoRouter)

export default app;
