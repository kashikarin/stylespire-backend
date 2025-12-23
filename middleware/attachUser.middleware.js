import { userService } from "../api/user/user.service.js"

export async function attachUser(req, res, next) {
    try {
        const user = await userService.getById(req.loggedInUser._id)
        if (!user) return res.status(401).send({ error: 'USER_NOT_FOUND' })

        req.loggedInUser = user
        next()
    } catch (err) {
    next(err)
    }
}