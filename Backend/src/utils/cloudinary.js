import fs from "fs"
import dotenv from "dotenv";
dotenv.config();

import cloudinary from "cloudinary"
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloundinary = async (localFilePath) => {
    
    try {
        if (!localFilePath ) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
    })
    fs.unlinkSync(localFilePath)
    return response
        
    } catch (error) {
        
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
        console.error("Something went wrong with cloundnary code", error)
    }
    
}
export default uploadOnCloundinary