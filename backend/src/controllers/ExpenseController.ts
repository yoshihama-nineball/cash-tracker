import { Request, Response } from 'express'
import Expense from '../models/Expense'

export class ExpenseController {
  // static getAll = async (req: Request, res: Response) => {
  //   try {
  //     //MEMO: 予算IDを取得し、whereの条件に加える
  //     const budgetId = req.params.budgetId
  //     // MongoDBの場合は以下のようになります
  //     const expenses = await Expense.find({ budgetId })
  //       .sort({ createdAt: -1 })
  //       .exec()
  //
  //     res.status(201).json(expenses)
  //   } catch (error) {
  //     // console.log(error)
  //     res.status(500).json({ error: 'エラーが発生しました' })
  //   }
  // }

  static create = async (req: Request, res: Response) => {
    try {
      // MongoDBではcreateでデータを作成、その際にbudgetIdを同時に設定
      const expense = await Expense.create({
        ...req.body,
        budgetId: req.budget._id,
        budget: req.budget._id, // 両方のフィールドに設定
      })

      res.status(201).json('支出が正しく作成されました')
    } catch (error) {
      // console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }

  static getById = async (req: Request, res: Response): Promise<void> => {
    // Sequelizeと同様にreq.expenseを使う前提（ミドルウェアで設定）
    res.json(req.expense)
  }

  static updateById = async (req: Request, res: Response) => {
    try {
      // Sequelizeと同様にreq.expenseを使う前提（ミドルウェアで設定）
      await Expense.findByIdAndUpdate(req.expense._id, req.body)
      res.json('支出の編集に成功しました')
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static deleteById = async (req: Request, res: Response) => {
    try {
      // Sequelizeと同様にreq.expenseを使う前提（ミドルウェアで設定）
      await Expense.findByIdAndDelete(req.expense._id)
      res.json('支出の削除に成功しました')
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }
}
