import { Router } from "express";
import { register,
         userLogin,
         logOutUser,
         refrashAcessToken,
         health,
         profile,
         profilePicUpdate,
         coverImageUpdate,
         updateProfile  } from "../controller/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js"
import multer from "multer";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },  
    { name: "coverImage", maxCount: 1 },
  ]),
  register
);
router.get("/health", health)
router.post("/login", userLogin);

// secured routes
router.post("/logout",verifyJWT, logOutUser )
router.get("/profile/:userName", profile )
router.post("/updateprofile",verifyJWT, updateProfile )
router.post("/profilePicUpdate",
  upload.fields([
    { name: "profilePic", maxCount: 1 }
  ]),verifyJWT, profilePicUpdate )

  router.post("/coverImageUpdate",
  upload.fields([
    { name: "coverImage", maxCount: 1 }
  ]),verifyJWT, coverImageUpdate )

router.get("/refrashtoken", refrashAcessToken)

export default router;
