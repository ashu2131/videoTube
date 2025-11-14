import { Router } from "express";
import {
  createVideo,
  updatedVideo,
  updateThumnail,
  editVideoDetails,
  deleteVideo,
  getVideo,
  getAllVideo,
} from "../controller/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const videoRouter = Router();

videoRouter.post(
  "/createvideo",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

videoRouter.patch(
  "/updatevideo:_id",
  verifyJWT,
  upload.fields([{ name: "videoFile", maxCount: 1 }]),
  updatedVideo
);

videoRouter.patch(
  "/editVideoDetails/:_id",
  verifyJWT, editVideoDetails,
);

videoRouter.patch("/updatethumnail/:_id", verifyJWT,upload.fields([{name: "thumbnail", maxCount: 1}]), updateThumnail,)

videoRouter.get("/getvideo/:_id", getVideo);
videoRouter.get("/getallvideos", getAllVideo);

export default videoRouter;
