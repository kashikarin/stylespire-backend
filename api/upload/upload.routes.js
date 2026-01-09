import express from 'express'
import { log } from '../../middleware/logger.middleware.js'
import { uploadImage } from './upload.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { uploadSingle } from '../../middleware/upload.middleware.js'

const router = express.Router()


router.post('/image', log, requireAuth, uploadSingle, uploadImage)

export const uploadRoutes = router