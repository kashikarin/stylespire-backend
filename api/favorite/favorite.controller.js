import { ObjectId } from 'mongodb'
import { loggerService } from '../../services/logger.service.js'
import { favoriteService } from './favorite.service.js'

export async function getFavorites(req, res){
    const filterFavoritesBy = req.query
    try {
        if (filterFavoritesBy.userId) filterFavoritesBy.userId = new ObjectId(filterFavoritesBy.userId)
        const favorites = await favoriteService.query(filterFavoritesBy)
        res.json(favorites)
    } catch(err) {
        loggerService.error('Failed to get favorites', err)
        res.status(400).send({ err: 'Failed to get favorites' })
    }
}

export function getFavorite(req, res) {
    const { favoriteId } = req.params
    try {
        const favorite = favoriteService.getById(favoriteId)    
        res.json(favorite)
    } catch(err) {
        loggerService.error(`Failed to get favorite by id ${favoriteId}`, err)
        res.status(400).send({ err: 'Failed to get favorite' })
    }
}

export async function addFavorite(req, res) {
    const {loggedInUser} = req
    const favorite = req.body
    try {
        favorite.user = {
            _id: new ObjectId(loggedInUser._id),
            fullname: loggedInUser.fullname
        }
        const addedFavorite = await favoriteService.add(favorite)
        res.json(addedFavorite)
    } catch(err) {
        loggerService.error('Failed to add a favorite', err)
        res.status(400).send({ err: 'Failed to add a favorite' })
    }
}

export async function removeFavorite(req, res) {
    const {favoriteId} = req.params
    try {
        const removedId = await favoriteService.remove(favoriteId)
        res.json(removedId)
    } catch(err) {
        loggerService.error(`Failed to remove favorite by id ${favoriteId}`, err)
        res.status(400).send({ err: 'Failed to remove favorite' })
    }
}

export async function updateFavorite(req, res) {
    const { favoriteId } = req.params
    const fieldsToUpdate = req.body
    try {
        const updatedFavorite = await favoriteService.update(favoriteId, fieldsToUpdate)
        updatedFavorite._id = updatedFavorite._id.toString()
        updatedFavorite.user._id = updatedFavorite.user._id.toString()
        res.json(updatedFavorite)
    } catch (err) {
        loggerService.error(`Failed to update favorite by id ${favoriteId}`, err)
        res.status(400).send({ err: 'Failed to update favorite' })
    }   
}