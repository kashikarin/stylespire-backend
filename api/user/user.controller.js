import { loggerService } from '../../services/logger.service.js'
import { userService } from './user.service.js'
import { authService } from '../auth/auth.service.js'

export async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id)
    if (!user) return res.status(404).send({ err: 'User not found' })
    res.send(user)
  } catch (err) {
    loggerService.error('Failed to get user', err)
    res.status(400).send({ err: 'Failed to get user' })
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userService.query()
    res.send(users)
  } catch (err) {
    loggerService.error('Failed to get users', err)
    res.status(400).send({ err: 'Failed to get users' })
  }
}

