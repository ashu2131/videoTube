import { asyncHandler } from "../utils/aysncHandler.js";

const createVideo = asyncHandler((req, res) => {
    res.send("create your create")
})

export {createVideo}