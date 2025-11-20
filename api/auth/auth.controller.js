import { loggerService } from "../../services/logger.service.js"
import { authService } from "./auth.service.js"

export async function signup(req, res) {
  try {
    const credentials = req.body
    const { user, accessToken, refreshToken } = await authService.signup(credentials)
    
    loggerService.debug("auth.routes - new account created", user)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,  //in production change to true
        sameSite: "lax",
        path: "/"
    })

    res.json({ user, accessToken })

    loggerService.info('User signup:', { email: user.email, _id: user._id } )
    
  } catch (err) {
    loggerService.error('Failed to signup ', err)
    res.status(400).json({ err: err.message || 'Failed to signup' })
  }
}

export async function login(req, res) {
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

    res.json({ user, accessToken })



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

        const { user, accessToken, refreshToken: newRefreshToken } = await authService.refresh(oldRefreshToken);

        loggerService.debug("auth.routes - token refreshed", { _id: user._id })

    // Replace old cookie with new refresh token
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false, // in production = true
            sameSite: "lax",
            path: "/"
        })

        res.json({ user, accessToken })

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