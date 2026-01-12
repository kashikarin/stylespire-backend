import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

function toObjectId(id) {
    if (id instanceof ObjectId) return id
    if (ObjectId.isValid(id)) return new ObjectId(id)
    throw new Error(`❌ Invalid ObjectId: ${id}`)
}

export const favoriteService = {
  query,
  getById,
  add,
  remove,
}

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)    
    const collection = await dbService.getCollection('favorite')
    const favoriteCursor = await collection.find(criteria)
    const favorites = await favoriteCursor.toArray()
    
    return favorites
  } catch (err) {
    loggerService.error('cannot find favorites', err)
    throw err
  }
}

async function getById(favoriteId) {
  try {
    const criteria = { _id: toObjectId(favoriteId) }
    const collection = await dbService.getCollection('favorite')
    const favorite = await collection.findOne(criteria)
    return favorite
  } catch (err) {
    loggerService.error(`while finding favorite ${String(favoriteId)}`, err)
    throw err
  }
}

async function add(favorite) {
  try {
    const collection = await dbService.getCollection('favorite')
    const result = await collection.insertOne(favorite)
    favorite._id = result.insertedId
    return favorite
  } catch (err) {
    loggerService.error('Failed to add favorite', err)
    throw err
  }
}

async function remove(favoriteId) {
  const criteria = { _id: toObjectId(favoriteId) }
  try {
    const collection = await dbService.getCollection('favorite')
    const res = await collection.deleteOne(criteria)
    if (res.deletedCount === 0) throw new Error('Wrong favorite')
    return favoriteId
  } catch (err) {
    loggerService.error('Failed to remove favorite', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.userId) criteria['user._id'] = filterBy.userId
  if (filterBy.imageId) criteria.imageId = filterBy.imageId
  if (filterBy.description) criteria.description = { $regex: filterBy.description, $options: 'i' }
  if (filterBy.createdAt) criteria.createdAt = { $gte: new Date(filterBy.createdAfter) }
  
  
  return criteria
}