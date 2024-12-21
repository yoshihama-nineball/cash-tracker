// import express from 'express';
// import colors from 'colors';
// import morgan from 'morgan';
// import { db } from './config/db';

// async function connectDB() {
//   try {
//     await db.authenticate();
//     await db.sync();
//     console.log(colors.blue.bold('接続は成功しました'));
//   } catch (error) {
//     console.error('接続に失敗しました:', error);
//   }
// }

// const app = express();

// app.use(morgan('dev'));
// app.use(express.json());

// connectDB();

// app.listen(process.env.PORT || 3000, () => {
//   console.log(colors.green(`Server is running on port ${process.env.PORT || 3000}`));
// });

// export default app;

import express  from "express";
import router from "./router";
import connectDB from "./config/db";


connectDB();

const app = express();

app.use(express.json());

app.use('/', router);

export default app;