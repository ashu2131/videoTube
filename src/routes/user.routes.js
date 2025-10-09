import { Router } from "express";
const router = Router()
import { registerUser} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"

router.route("/register",).post(upload.fields([
    {
        name:"avtar",
        maxCount:1
    },
    {
        name:"images",
        maxCount:3
    }
]),registerUser)
export default router
