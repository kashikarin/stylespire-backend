import { ObjectId } from 'mongodb'
import { loggerService } from '../../services/logger.service.js'
import { boardService } from './board.service.js'

export async function getBoards(req, res){
    const { loggedInUser } = req
    try {
        const userId = loggedInUser._id
        const boards = await boardService.query({ userId })
        res.json(boards)
    } catch(err) {
        loggerService.error(`Failed to get boards of user ${loggedInUser._id}`)
        res.status(400).send({ err: 'Failed to get boards' })
    }
}

export async function getBoard(req, res) {
    const { loggedInUser } = req

    try {
        const board = await boardService.getLastBoardByUserId(loggedInUser._id)
        console.log('latest board:', board)
        res.json(board)
    } catch(err) {
        loggerService.error(`Failed to get board by userId ${loggedInUser._id}`, err)
        res.status(400).send({ err: 'Failed to get board' })
    }
}

export async function addBoard(req, res) {
        console.log('loggedInUser:', req.loggedInUser)

    const { loggedInUser } = req
    console.log("🚀 ~ addBoard ~ loggedInUser:", loggedInUser)
    try {
        const board = {
            ...req.body,
            user: {
                _id: new ObjectId(loggedInUser._id),
                fullname: loggedInUser.fullname
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        
        const addedBoard = await boardService.add(board)
        res.json(addedBoard)
    } catch(err) {
        loggerService.error('Failed to add a board', err)
        res.status(400).send({ err: 'Failed to add a board' })
    }
}

export async function updateBoard(req, res){
    const board = req.body
    console.log("🚀 ~ updateBoard ~ req.body:", req.body)

    try{
        const updatedBoard = await boardService.update(board)
        console.log("🚀 ~ updateBoard ~ updatedBoard:", updatedBoard)
        res.json(updatedBoard)
    } catch(err) {
        loggerService.error('Failed to update a board', err)
        res.status(400).send({ err: 'Failed to update a board' })
    }
} 