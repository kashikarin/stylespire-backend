import { uploadService } from "./upload.service.js"

export async function uploadImage(req, res) {
    const file = req.file
    try {
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }
        const relativePath = await uploadService.upload(file)
        
        res.json({ url: relativePath})
    } catch (err) {
        res.status(500).send({ error: 'Failed to upload image' })
    }
}
