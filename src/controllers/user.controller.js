import { asyncHandler } from "../utils/asynchandler.js";


const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json({message: "this is working"})
})


const loginUser = asyncHandler( async (req, res) => {
    res.status(200).json({message: "this is login user"})
})

export {registerUser, loginUser}