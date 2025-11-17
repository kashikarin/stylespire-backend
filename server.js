import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { clarifaiRoutes } from './api/clarifai/clarifai.routes.js'
import { recipesRoutes } from './api/recipes/recipes.routes.js'


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/clarifai", clarifaiRoutes)
app.use("/api/recipes", recipesRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))