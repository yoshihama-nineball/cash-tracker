import colors from 'colors'
import dotenv from 'dotenv'
import 'reflect-metadata'
import server from './server'

dotenv.config()

const port = process.env.PORT || 4000

server.listen(port, () => {
  console.log(colors.cyan.bold(`APIのポート番号は ${port}です`))
})
