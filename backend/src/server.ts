import 'reflect-metadata'
import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'
import { limiter } from './config/limiter'
// import authRouter from './routes/authRouter'

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.blue.bold('Sequelizeに接続しました'))
  } catch (error) {
    // console.log(error)
    console.log(colors.red.bold(error.message))
  }
}
connectDB()

const app = express()

//morganミドルウェアを使ったHTTPリスエスト結果の表示
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
