import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './api/auth/auth.routes.js'
import cookieParser from 'cookie-parser'
import { setupAsyncLocalStorage } from './middleware/setupAls.middleware.js'
import path from 'path'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:8000',
      'http://localhost:8000',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5174',
      'http://localhost:5174'
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

app.use(setupAsyncLocalStorage)

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))