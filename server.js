import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './api/auth/auth.routes.js'
import cookieParser from 'cookie-parser'
import { setupAsyncLocalStorage } from './middleware/setupAls.middleware.js'
import path from 'path'
import { userRoutes } from './api/user/user.routes.js'
import { favoriteRoutes } from './api/favorite/favorite.routes.js'
import { boardRoutes } from './api/board/board.routes.js'
import { backgroundRoutes } from './api/background/background.routes.js'
import { uploadRoutes } from './api/upload/upload.routes.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())

const __dirname = process.cwd()
app.use(
    '/uploads', 
    express.static(path.join(__dirname, 'uploads'))
)

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
app.use("/api/user", userRoutes)
app.use("/api/favorite", favoriteRoutes)
app.use("/api/board", boardRoutes)
app.use("/api/background", backgroundRoutes)
app.use("/api/upload", uploadRoutes)

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))