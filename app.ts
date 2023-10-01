import dotenv from 'dotenv'
import express from 'express'
import db from './config/connectToDb.ts'
import { authRouter } from './routes/authRoute.ts'
import { postRouter } from './routes/postRoute.ts'
import { userRouter } from './routes/userRoute.ts'
dotenv.config()

//connect to db
db()

//init app
const app = express()

//middlewares
app.use(express.json())

//routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.get('/', (req, res) => res.send('Hello World!'))
//running the server
const PORT = process.env.PORT || 8000
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
)
