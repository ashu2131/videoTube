const asyncHandler = (reusetHandler) => {
    return (req, res, next) => {
        Promise.resolve(reusetHandler(req, res, next))
        .catch((err) => next())
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