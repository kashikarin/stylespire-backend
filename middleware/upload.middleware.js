import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = 'uploads/boards'

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.png'
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        cb(null, filename)
    }
})

export const uploadSingle = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'))
        }
        cb(null, true)
    }
}).single('file')