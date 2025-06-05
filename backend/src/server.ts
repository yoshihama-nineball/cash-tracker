import colors from 'colors'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import { db } from './config/db'
import { limiter } from './config/limiter'
import authRouter from './routes/authRouter'
import budgetRouter from './routes/budgetRouter'

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.blue.bold('MongoDBに接続しました'))
  } catch (error: any) {
    console.log(colors.red.bold(error.message))
  }
}
connectDB()

const app = express()

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://cash-tracker-six.vercel.app/'],
    credentials: true,
  }),
)

app.use(morgan('dev'))
app.use(express.json())
app.use(limiter)

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, world!' })
})

app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)

app.use('/', (req, res) => {
  res.send('ユニットテストの動作確認')
})

export default app
