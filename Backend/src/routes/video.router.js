import { Router } from "express";
import { createVideo } from "../controller/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const videoRouter = Router()

videoRouter.get("/createvideo", verifyJWT, createVideo)


export default videoRouter
