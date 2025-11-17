import { cloudinaryService } from "./cloudinary.service"

export async function uploadToCloudinary(req, res) {
    try {
        const file = req.file
        if (!file) return res.status(400).send({ err: "No file uploaded" })

        // multer already uploads to Cloudinary
        res.send({
            url: file.path, // Cloudinary URL
            publicId: file.filename
        })
    } catch (err) {
        console.error(err)
        res.status(400).send({ err: "Upload failed" })
    }
}