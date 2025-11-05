import { userModel } from "../model/user.model.js";
import uploadOnCloundinary from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//generateAccessAndRefereshTokens code
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refrashToken = user.generateRefreshToken();
    user.refrashToken = refrashToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refrashToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
//Register user conttrolers code
const register = asyncHandler(async (req, res) => {
  console.log("➡️  register route hit hua");
  let { fullName, userName, email, password } = req.body;
  if (
    [fullName, userName, email, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "all fields are required");
  }

  let profileLocalPath = req.files?.profilePic[0]?.path;
  if (!profileLocalPath) {
    throw new ApiError(400, "something wants wrong");
  }
  let coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "something wants wrong");
  }

  let profilepic = await uploadOnCloundinary(profileLocalPath);
  if (!profilepic) {
    throw new ApiError(400, "something wants wrong");
  }

  let coverImage = await uploadOnCloundinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError(400, "something wants wrong");
  }

  //check users are exits
  let existedUser = await userModel.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser) {
    throw new ApiError(400, "user already exits");
  }

  let user = await userModel.create({
    fullName,
    userName,
    email,
    password,
    profilePic: profilepic.url,
    coverImage: coverImage.url,
  });

  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refrashToken");
  if (!createdUser) {
    throw new ApiError(404, "user is not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "Your is created successful"));
});
//Login user conttrolers code
const userLogin = asyncHandler(async (req, res) => {
  let { email, userName, password } = req.body;

  // check username and email
  if (!userName && !email) {
    throw new ApiError(401, "userName and email is required");
  }
  // find the user on the db thow username and email
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "create user account first");
  }
  // check password
  let userPassword = await user.isPasswordCorrect(password);
  if (!userPassword) {
    throw new ApiError(404, "Incorrect password");
  }
  const { accessToken, refrashToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refrashToken");
  const option = {
    httpOnly: true,
    secure: true, // must false for localhost
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refrashToken", refrashToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refrashToken },
        "you are logged successfully"
      )
    );
});
//LogOut user conttrolers code
const logOutUser = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refrashToken: 1 },
    },
    { new: true }
  );
  console.log("logged user", user);

  const option = {
    httpOnly: true,
    secure: true, // must false for localhost
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refrashToken", option)
    .json(new ApiResponse(200, {}, "your are successfully logout"));
});

// user refrashtoken endpoint
const refrashAcessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRecreachToken =
      req.cookies.refrashToken || req.body.refrashToken;
    if (!incomingRecreachToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(
      incomingRecreachToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await userModel.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "invelid refreash token");
    }
    let Option = {
      httpOnly: true,
      secure: true,
    };

    if (incomingRecreachToken !== user.refrashToken) {
      throw new ApiError(401, "invelid refreash token");
    }
    let { accessToken, newRefrashToken } = generateAccessAndRefereshTokens(
      user._id
    );

    return res.status(200).cookies("accessToken", accessToken, Option);
    cookies("refrashToken", newRefrashToken, Option);
    json(
      new ApiResponse(
        200,
        { accessToken, refrashToken: newRefrashToken },
        "your route is working"
      )
    );
  } catch (error) {
    throw new ApiError(401, "Unatuthorized refrash token");
  }
});
// application health check endpoint
const health = asyncHandler((req, res) => {
  return res.status(200).json(new ApiResponse(200, {}, "Good Health  "));
});
// get userporile
const profile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw new ApiError(404, "user not found");
  }
  const user = await userModel.aggregate([
    {
      $match: {
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "chennal",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribersTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribersToCount: {
          $size: "$subscribersTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        profilePic: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribersToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  console.log(user);
  res.send(user);

  // return  res.status(200).json(new ApiResponse(200,req.user,"Good Health  "))
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(401, "Full Name and Email is required");
  }
  user = await userModel
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName,
          email,
        },
      },
      {
        new: true,
      }
    )
    .select("-password");
  user.save({ validateBeforeSave: true });
  return res.status(200).json(new ApiResponse(200, req.user, "Good Health  "));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "old Password and New Password are required");
  }
  const user = await userModel.findById(req.user?._id).select("-password");

  const correctOldPassword = user.isPasswordCorrect(oldPassword);
  if (!correctOldPassword) {
    throw new ApiError(401, "old password is invalid Please try again");
  }
  user.password = newPassword;
  user.save({ validateBeforeSave: true });
  return res.status(200).json(new ApiResponse(200, user, "Good Health  "));
});

const profilePicUpdate = asyncHandler(async (req, res) => {
  try {
    const profilePicPath = req.files?.profilePic[0]?.path;
    if (!profilePicPath) {
      throw new ApiError(401, "profilePic path not found");
    }
    let profilepic = await uploadOnCloundinary(profilePicPath);
    if (!profilepic) {
      throw new ApiError(400, "cloundinary path not found");
    }
    const user = await userModel.findById(req.user._id).select("-password");
    user.profilePic = profilepic.url;
    user.save({ validateBeforeSave: true });
    return res.status(200).json(new ApiResponse(200, user, "Good Health  "));
  } catch (error) {
    throw new ApiError(401, "profilePic not fount");
  }
});

const coverImageUpdate = asyncHandler(async (req, res) => {
  try {
    const coverImagePath = req.files.coverImage.path;
    if (!coverImagePath) {
      throw new ApiError(401, "cover image path not found");
    }
    let coverImage = await uploadOnCloundinary(profilePicPath);
    if (!coverImage) {
      throw new ApiError(400, "cover image on cloundinary path not found");
    }
    const user = await userModel.findById(req.user._id).select("-password");
    user.coverImage = coverImage.url;
    user.save({ validateBeforeSave: true });
    return res.status(200).json(new ApiResponse(200, user, "Good Health  "));
  } catch (error) {
    throw new ApiError(401, "CoverImage not fount");
  }
});

const watchHistory = asyncHandler(async (req, res) => {
const user = await userModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    profilePic: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "WatchHistory fetch successfully"
      )
    );
});


export {
  health,
  register,
  userLogin,
  logOutUser,
  refrashAcessToken,
  profile,
  updateProfile,
  updatePassword,
  coverImageUpdate,
  profilePicUpdate,
  watchHistory,
};
