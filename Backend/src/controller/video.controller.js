import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { videoModel } from "../model/video.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "node:path";
import { ApiError } from "../utils/ApiError.js";

// function to rename video file and move to temp folder and upload on cloudinary
const videoFile =  async function videoFile(originalPath, newFileName) {
    const videoExtention = path.extname(originalPath.path);
    const newFileNameWithExt = `${newFileName + videoExtention}`;
    const renamedFilePath = path.join("public/temp", newFileNameWithExt); 

    fs.renameSync(originalPath.path, renamedFilePath);

    const videoPath = await uploadOnCloudinary(renamedFilePath, "video");
    if (!videoPath) {
        throw new Error("Cannot upload video on cloudinary");
    }
    return videoPath.url;
}



const createVideo = asyncHandler(async (req, res) => {
    const videoName = req.body.videoName
    if (!videoName) {
        res.status(400).json(new ApiError(400, "videoName is required"))
    }

    const videoFilesLocalPath = req.files?.videoFile[0];
    if (!videoFilesLocalPath) {
        res.status(400).json(new ApiError(400, "video file is required"))
    }
    
    const videoFilesLocalNewPath = await videoFile(videoFilesLocalPath, videoName)

    // thumbnail
    const thumbnailLocalPath = req.files?.thumbnail[0].path
    if (!thumbnailLocalPath) {
        res.status(400).json(new ApiError(400, "thumbnail is required"))
    } 

    // upload thumbnail on cloudinary
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath, "image")
    if (!thumbnailUrl) {
        res.status(500).json(new ApiError(500, "Cannot upload thumbnail on cloudinary"))
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
        videoFile: videoFilesLocalNewPath.url,
        thumbnail: thumbnailUrl.url,
        title: videoTitle,
        description: videoDescription,
        duration: videoFilesLocalNewPath.duration,
        owner: req.user._id,
    })
    res.status(201).json(new ApiResponse(true, "Video created successfully", video))
})

// updated video controller
const updatedVideo = asyncHandler(async (req, res) => {
   
    //get video id from params
    const videoId = req.params._id
    if (!videoId) {
        res.status(400).json(new ApiError(400, "Video id is required"))       
    }

    //get video name from body
    const videoName = req.body.videoName

    // get video file from req files
    const videoFilesLocalPath = req.files?.videoFile[0];
    if (!videoFilesLocalPath) {
        res.status(400).json(new ApiError(400, "video file is required"))
    }

    // rename and move video file to temp folder and upload on cloudinary
    const videoFilesLocalNewPath = await videoFile(videoFilesLocalPath, videoName)
    const video = await videoModel.findByIdAndUpdate(videoId, {videoFile: videoFilesLocalNewPath})
    if (!video) {
        res.status(404).json(new ApiError(404, "Video not found"))
    }
    res.status(200).json(new ApiResponse(true, "Video updated successfully", video))
})

// delete video controller
const deleteVideo = asyncHandler(async (req, res) => {
    const videId = req.params?._id
    await videoModel.findByIdAndDelete({_id: videId})
    const videos = await videoModel.getAllVideo()
    res.status(200).json(new ApiResponse(200, videos, "Video is deleted successfully"))

})

const getVideo = asyncHandler(async (req, res) => {
    const videId = req.params?._id
   const video =  await videoModel.findById({_id: videId})
   res.status(200).json(new ApiResponse(200, video, "success"))
    
})

const getAllVideo = asyncHandler(async (req, res) => {
    const videos = await videoModel.getAllVideo()
    res.status(200).json(new ApiResponse(200, videos, "All video fetch successfully"))
})

export {createVideo,
    updatedVideo,
    deleteVideo,
    getVideo}