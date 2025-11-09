import { Router } from "express";
import { createVideo } from "../controller/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const videoRouter = Router()

videoRouter.post("/createvideo", verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
         { name: "thumbnail", maxCount: 1 },
    ]),
    createVideo)

export default videoRouter
