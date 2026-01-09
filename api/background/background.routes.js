import express from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { removeBackground } from './background.controller.js'

const router = express.Router()

router.post('/remove', requireAuth, removeBackground)

export const backgroundRoutes = router