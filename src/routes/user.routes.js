import { Router } from "express";
const router = Router()
import { registerUser, loginUser } from "../controllers/user.controller.js";

router.route("/register",).get(registerUser)
router.route("/login",).get(loginUser)
export default router
