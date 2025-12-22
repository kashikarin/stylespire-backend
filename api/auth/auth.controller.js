import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"
import { authService } from "./auth.service.js"

export async function signup(req, res) {
  try {
    const credentials = req.body
    const { user, accessToken, refreshToken } = await authService.signup(credentials)
    
    loggerService.debug("auth.routes - new account created", user)

    const isProd = process.env.NODE_ENV === 'production'

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd, 
        sameSite: isProd ? 'None' : "lax",
        path: "/"
    })

    res.json({ user: normalizeUser(user), accessToken })

    loggerService.info('User signup:', { email: user.email, _id: user._id } )
    
  } catch (err) {
    loggerService.error('Failed to signup ', err)
    res.status(400).json({ err: err.message || 'Failed to signup' })
  }
}

export async function login(req, res) {
  console.log('🍪 cookies:', req.cookies)

  try {
    const credentials = req.body
    const { user, accessToken, refreshToken } = await authService.login(credentials)
    
    loggerService.debug("auth.routes - user login", user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,  //in production change to true
        sameSite: "lax",
        path: "/"
    })

    loggerService.info("User login", { email: user.email, _id: user._id })

    res.json({ user: normalizeUser(user), accessToken })



    // const { username, email, password } = req.body

    // if (!password || (!username && !email)) {
    //   return res.status(400).send({ err: 'Missing required fields' })
    // }

  } catch (err) {
    loggerService.error('Failed to Login ', err)
    res.status(401).json({ err: err.message || 'Failed to Login' })
  }
}

export async function refresh(req, res) {
    try {
        const oldRefreshToken = req.cookies.refreshToken

        if (!oldRefreshToken) {
            return res.status(401).json({ error: "Missing refresh token" });
        }

        const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(oldRefreshToken);

        loggerService.debug("auth.routes - token refreshed")

    // Replace old cookie with new refresh token
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false, // in production = true
            sameSite: "lax",
            path: "/"
        })

        res.json({ accessToken })

  } catch (err) {
    loggerService.error("Failed to refresh token", err);
    res.status(401).json({ error: err.message || "Token refresh failed" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    })
    res.json({ msg: 'Logged out successfully' })
  } catch (err) {
    loggerService.error("Failed to logout", err)
    res.status(500).json({ err: 'Failed to logout' })
  }
}

export async function getMe(req, res) {
  const loggedInUser = req.loggedInUser
  console.log("🚀 ~ getMe ~ loggedInUser:", loggedInUser)
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ 
      _id: new ObjectId(loggedInUser._id)
    })
    if (!user) return res.status(404).send({ err: 'User not found' })
    
    res.json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      createdAt: user.createdAt
    })
  } catch(err) {
    loggerService.error("Failed to load user", err)
    res.status(500).json({ err: 'Failed to load user' })
  }
}

function normalizeUser(user) {
  console.log("🚀 ~ normalizeUser ~ user:", user)
  return {
    _id: user._id,
    fullname: user.fullname,
    email: user.email
  }
}