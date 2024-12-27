// import express  from "express";
// import router from "./router";
// import connectDB from "./config/db";

// connectDB();

// const app = express();

// app.use(express.json());

// app.use('/', router);

// export default app;
import 'reflect-metadata';
import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { db } from './config/db';
import budgetRouter from './routes/budgetRouter';
// import authRouter from './routes/authRouter'

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.blue.bold('Sequelizeに接続しました'));
  } catch (error) {
    // console.log(error)
    console.log(colors.red.bold(error.message));
  }
}
connectDB();

const app = express();

//morganミドルウェアを使ったHTTPリスエスト結果の表示
app.use(morgan('dev'));

app.use(express.json());

app.use('/api/budgets', budgetRouter);
// app.use('/api/auth', authRouter)

export default app;
