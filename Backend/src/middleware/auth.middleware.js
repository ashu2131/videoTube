import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/aysncHandler.js";
import dotenv from "dotenv"
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../model/user.model.js";
dotenv.config()

const verifyJWT = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    if(!accessToken){
        throw new ApiError(404, "user not found please login your account 😂🤣" )
    }
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
     if(!decodedToken){
        throw new ApiError(404, "invalid decoded access token")
    }
    const user = await userModel.findById(decodedToken._id)
    if(!decodedToken){
        throw new ApiError(404, "user not find")
    }
    req.user = user
    next();
    // const user = await 
})
export {verifyJWT}