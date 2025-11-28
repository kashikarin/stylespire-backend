import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'
import { loggerService } from '../../services/logger.service.js'

export const userService = {
  query,
  getById
}

async function query() {
  try {
    const collection = await dbService.getCollection('user')
    const userCursor = await collection.find({})
    const users = await userCursor.toArray()
    return users
  } catch (err) {
    loggerService.error('cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const criteria = { _id: ObjectId.createFromHexString(userId) }
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne(criteria)
    return user
  } catch (err) {
    loggerService.error(`while finding user ${String(userId)}`, err)
    throw err
  }
}
