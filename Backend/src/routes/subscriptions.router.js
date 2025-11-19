import { Router } from "express";
import { subscribeTo, unSubscribeTo } from "../controller/subscriptions.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const subscriptionRouter = Router();


subscriptionRouter.get("/subscribeto/:userName", verifyJWT, subscribeTo);
subscriptionRouter.get("/unsubscribeto/:userName", verifyJWT, unSubscribeTo);


export default subscriptionRouter;
