import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

function toObjectId(id) {
    if (id instanceof ObjectId) return id
    if (ObjectId.isValid(id)) return new ObjectId(id)
    throw new Error(`❌ Invalid ObjectId: ${id}`)
}

export const boardService = {
  query,
  getLastBoardByUserId,
//   getById,
  add,
//   remove,
  update
}

async function query(filterBy = {}) {
  console.log("🚀 ~ filterBy:", filterBy)
  try {
    const criteria = _buildCriteria(filterBy)    
    const collection = await dbService.getCollection('board')
    const boardCursor = await collection.find(criteria)
    const boards = await boardCursor.toArray()
    
    return boards
  } catch (err) {
    loggerService.error('cannot find boards', err)
    throw err
  }
}

async function getLastBoardByUserId(userId){
    try {
        const collection = await dbService.getCollection('board')

        return await collection
            .findOne(
                { 'user._id': toObjectId(userId) },
                { sort: { updatedAt: -1 } }
            )

    } catch(err) {
        loggerService.error(`failed to find ${String(userId)}'s board`, err)
        throw err
    }
}
// async function getByUserId(userId) {
//   try {
//     const criteria = { _id: toObjectId(favoriteId) }
//     const collection = await dbService.getCollection('favorite')
//     const favorite = await collection.findOne(criteria)
//     return favorite
//   } catch (err) {
//     loggerService.error(`while finding favorite ${String(favoriteId)}`, err)
//     throw err
//   }
// }

async function add(board) {

  try {
    const collection = await dbService.getCollection('board')
    const result = await collection.insertOne(board)
    board._id = result.insertedId
    return board
  } catch (err) {
    loggerService.error('Failed to add board', err)
    throw err
  }
}

async function update(board) {   
  const criteria = { _id: toObjectId(board._id) }
  const { _id, ...boardToUpdate } = board
  
  boardToUpdate.user._id = toObjectId(boardToUpdate.user._id)
  
  try {

    const collection = await dbService.getCollection('board')
    const updatedBoard = await collection.findOneAndUpdate(
        criteria, 
        { $set: boardToUpdate },
        { returnDocument: 'after', upsert: false }
    )
    if (!updatedBoard) throw new Error('Board not found')
    return updatedBoard
  } catch (err) {
    loggerService.error('Failed to update board', err)
    throw err
  }
}

// async function remove(favoriteId) {
//   const criteria = { _id: toObjectId(favoriteId) }
//   try {
//     const collection = await dbService.getCollection('favorite')
//     const res = await collection.deleteOne(criteria)
//     if (res.deletedCount === 0) throw new Error('Wrong favorite')
//     return favoriteId
//   } catch (err) {
//     loggerService.error('Failed to remove favorite', err)
//     throw err
//   }
// }

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.userId) criteria['user._id'] = toObjectId(filterBy.userId)
//   if (filterBy.createdAt) criteria.createdAt = { $gte: new Date(filterBy.createdAfter) }
  
  
  return criteria
}