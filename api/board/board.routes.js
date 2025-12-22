import express from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { addBoard, getBoard, getBoards, updateBoard } from "./board.controller.js"

const router = express.Router()

router.get('/', requireAuth, getBoards)
router.get('/active', requireAuth, getBoard)
// router.delete('/:favoriteId', requireAuth, removeBoard)
router.post('/', requireAuth, addBoard)
router.put('/:boardId', requireAuth, updateBoard)

export const boardRoutes = router