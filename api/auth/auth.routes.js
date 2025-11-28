import express from 'express'
import { signup, login, refresh, logout, getMe } from "./auth.controller.js"
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/logout", logout)
router.get('/me', requireAuth, getMe)

export const authRoutes = router

