import { ApiError } from "./ApiError"

const asyncHandler = async (reusetHandler) => {
    (req, res, next) => {
        Promise.resolve(reusetHandler(req, res, next))
        .catch((err) => next(new ApiError(400, false, err, "somthing wents wrong")))
    }

}
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
        
//     } catch (error) {
//         res.status(error.CODE || 500).json({
//             success:false,
//             message: error.message
//         })
        
//     }
    

// }
export {asyncHandler}