import express from 'express'
import { log } from '../../middleware/logger.middleware.js'
import { getFavorites, getFavorite, removeFavorite, addFavorite } from './favorite.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', requireAuth, getFavorites)
router.get('/:favoriteId', requireAuth, getFavorite)
router.delete('/:favoriteId', requireAuth, removeFavorite)
router.post('/', log, requireAuth, addFavorite)

export const favoriteRoutes = router