import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { videoModel } from "../model/video.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";


const createVideo = asyncHandler(async (req, res) => {
    const videoName = req.body.videoName
    if (!videoName) {
        res.status(400)
        throw new Error("videoName is required")
    }

    const videoFilesLocalPath = req.files?.videoFile[0];
    if (!videoFilesLocalPath) {
        res.status(400)
        throw new Error("videoFile is required")
    }
    
    // get extention
    const videoExtention = path.extname(videoFilesLocalPath.path)
    if (!videoExtention) {
        res.status(400)
        throw new Error("Invalid video file")
    }
    
    // rename file
    const renameVideo = `${videoName+videoExtention}`
    if (!renameVideo) {
        res.status(500)
        throw new Error("Cannot rename video file")
    }
    
    // move file to temp folder with new name
    const videoFilesLocalNewPath = path.join("public/temp", renameVideo)
    if (!videoFilesLocalNewPath) {
        res.status(500)
        throw new Error("Cannot move video file")
    }

    // move file
   fs.renameSync(videoFilesLocalPath.path, videoFilesLocalNewPath)

    // upload on cloudinary
    const videoUrl = await uploadOnCloudinary(videoFilesLocalNewPath, "video")
    if (!videoUrl) {
        res.status(500)
        throw new Error("Cannot upload video on cloudinary")
    }

    // thumbnail
    const thumbnailLocalPath = req.files?.thumbnail[0].path
    if (!thumbnailLocalPath) {
        res.status(400)
        throw new Error("thumbnail is required")
    } 

    // upload thumbnail on cloudinary
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath, "image")
    if (!thumbnailUrl) {
        res.status(500)
        throw new Error("Cannot upload thumbnail on cloudinary")
    }
    
    // video title fields
    const videoTitle = req.body.title
    if (!videoTitle) {
        res.status(400)
        throw new Error("title is required")
    }

    // video description fields
    const videoDescription = req.body.description
    if (!videoDescription) {
        res.status(400)
        throw new Error("description is required")
    }

    const video = await videoModel.create({
        videoFile: videoUrl.url,
        thumbnail: thumbnailUrl.url,
        title: videoTitle,
        description: videoDescription,
        duration: videoUrl.duration,
        owner: req.user._id,
    })
    res.status(201).json(new ApiResponse(true, "Video created successfully", video))
})

export {createVideo}