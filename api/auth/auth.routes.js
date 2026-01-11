import express from 'express'
import { signup, login, refresh, logout, getMe, loginDemo } from "./auth.controller.js"
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/demo", loginDemo)
router.post("/refresh", refresh)
router.post("/logout", logout)
router.get('/me', requireAuth, getMe)

export const authRoutes = router

