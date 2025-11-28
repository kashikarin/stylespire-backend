import jwt from 'jsonwebtoken'
import { loggerService } from '../services/logger.service.js'
import { userService } from '../api/user/user.service.js'

export async function requireAuth(req, res, next) {

  try {

    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).send('No token provided')
    
    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    const userId = decoded._id


    const user = await userService.getById(userId)
    if (!user) return res.status(401).send('User not found')
    
    req.loggedInUser = user

    next()
  } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send({ error: 'TOKEN_EXPIRED' })
        }
        const user = req.loggedInUser || {}
        const userId = user._id || 'Unknown'
        const name = user.fullname || user.username || 'Unknown'

    loggerService.error('Auth middleware error:', { userId, name, err })
    res.status(401).send({ err: 'Invalid token.' })
  }
}
