import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const cloudinaryService = {
  uploadImage
}

export async function uploadImage(filePath) {
    try {
        const res = await cloudinary.uploader.upload(filePath, {
            folder: "recipify",
        })
        return res
    } catch (err) {
        console.error("Cloudinary upload failed:", err)
        throw err
    }
}