import express from 'express'
import { requireAuth } from '../../middleware/auth.middleware.js'
import { addBoard, getBoard, getBoards, updateBoard } from "./board.controller.js"
import { attachUser } from '../../middleware/attachUser.middleware.js'

const router = express.Router()

router.get('/', requireAuth, getBoards)
router.get('/active', requireAuth, getBoard)
// router.delete('/:favoriteId', requireAuth, removeBoard)
router.post('/', requireAuth, attachUser, addBoard)
router.put('/:boardId', requireAuth, updateBoard)

export const boardRoutes = router