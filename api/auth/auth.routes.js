import express from 'express'
import { signup, login, refresh, logout } from "./auth.controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/logout", logout)

export const authRoutes = router

