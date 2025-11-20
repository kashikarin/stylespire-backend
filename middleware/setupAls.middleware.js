import { authService } from '../api/auth/auth.service.js'
import { asyncLocalStorage } from '../services/als.service.js'

export async function setupAsyncLocalStorage(req, res, next) {
	const storage = {}
	asyncLocalStorage.run(storage, () => {
		const authHeader = req.headers.authorization
		if (authHeader) {
			const token = authHeader.split(' ')[1]

			try {
				const loggedinUser = authService.validateToken(token)
				if (loggedinUser) {
					const alsStore = asyncLocalStorage.getStore()
					alsStore.loggedinUser = loggedinUser
				}
			} catch(err) {

			}
		}
		next()
	})
}
