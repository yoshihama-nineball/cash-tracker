import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();

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
});
// import { Sequelize } from 'sequelize-typescript'
// import dotenv from 'dotenv'
// dotenv.config()

// export const db = new Sequelize( process.env.DATABASE_URL , {
//     models: [__dirname + '/../models/**/*' ],
//     logging: false,
//     dialectOptions: {
//         ssl: {
//             require: false
//         }
//     }
// })
