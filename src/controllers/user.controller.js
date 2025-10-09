import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  let { username, email, fullName, password } = req.body;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    [username, email, fullName, password].some((field) => field?.trim() == " ")
  ) {
    throw new ApiError(400, "All fields are requered");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }
  let exitedUser = User.findOne({ $or: [{ username }, { email }] });
  console.log(username, email, fullName);
  if (exitedUser) {
    throw ApiError(406, "User is already exits");
  }

  let avatarLocalPath = req.files?.avtar[0]?.path
   if (!avatarLocalPath) {
    throw ApiError(406, "avter is not upload on local")
  }
  let coverImageLocalPath = req.files?.coverImage[0]?.path
  let coverImage = await uploadOnCloudinary(coverImageLocalPath)
  let avtar = await uploadOnCloudinary(avatarLocalPath)
  if (!avtar) {
    throw ApiError(406, "avter is not upload on cloudary")
  }

  let userCreated = await User.create({
    username:username.toLowerCase(),
    fullName,
    email,
    password,
    avatar,
    coverImage
  })

  let user = await User.findById(user._id).select("-password -refreshToken")
  if (!user) {
    throw new ApiError(500, "Server is not working please check")
    
  }
  
  res.status(200).json(new ApiResponse(200,userCreated, "User is created successfully" ));
//   User.create({username, email, fullName, password, avtar:avatarLocalPath, coverImage : coverImageLocalPath })

  // get user details form fronted
  // validated - not empty
  // check if user is already exits: chech through by email and password
  // check images, check for avtar
  // check for image to upload on cloundary
  // create user update in db
  // remove password and refrash token from respose data
  // check your creation
  // return response

  res.status(200).json({ message: "this is working", });
});

export { registerUser };
