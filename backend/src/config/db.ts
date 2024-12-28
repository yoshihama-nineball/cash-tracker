import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()

export const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + '/../models/**/*'],
  logging: false,
  define: {
    timestamps: false,
  },
  dialectOptions: {
    ssl: {
      require: false,
    },
  },
  timezone: '+9:00', //日本時間に設定
})
