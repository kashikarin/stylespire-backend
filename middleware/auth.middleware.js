import jwt from 'jsonwebtoken'
import { loggerService } from '../services/logger.service.js'

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).send({ error: 'TOKEN_EXPIRED' })
    
    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token) {
      return res.status(401).send({err: 'Invalid authorization format'})
    }


    const decodedUser = jwt.verify(token, process.env.JWT_SECRET)

    req.loggedInUser = decodedUser

    next()

  } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send({ error: 'TOKEN_EXPIRED' })
        }
    
      loggerService.error('Auth middleware error:', { 
        errorName: err.name,
        errorMessage: err.message      
      })
      
      return res.status(401).send({ error: 'INVALID_TOKEN' })
  }
}
