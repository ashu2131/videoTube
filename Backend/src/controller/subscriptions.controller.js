import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { subsriptionModel } from "../model/subscription.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "node:path";
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../model/user.model.js";
// function to rename video file and move to temp folder and upload on cloudinary

const subscribeTo = asyncHandler(async (req, res) => {
    const userName = req.params.userName;

    if (!userName) {
        throw new ApiError(400, "userName is required");
    }

    const user = await userModel.findOne({ userName });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const existingSubscription = await subsriptionModel.findOne({
        subscriber: req.user._id,
        chennal: user._id
    });
    if (existingSubscription) {
        throw new ApiError(400, "Already subscribed to this user");
    }
    await subsriptionModel.create({
        subscriber: req.user._id,
        chennal: user._id
    });

    res.status(200).json(new ApiResponse(200, "Subscribed successfully", null));
});


const unSubscribeTo = asyncHandler(async (req, res) => {
    const userName = req.params.userName;
    if (!userName) {
        throw new ApiError(400, "userName is required");
    }
    const user = await userModel.findOne({ userName });

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    await subsriptionModel.findOneAndDelete({   
        subscriber: req.user._id,
        chennal: user._id
    });

    res.status(200).json(new ApiResponse(200, "Unsubscribed successfully", null));
});

export {subscribeTo, unSubscribeTo}

