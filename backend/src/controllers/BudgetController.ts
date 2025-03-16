import type { Request, Response } from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense'

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    // console.log('mockの結果', req.user.id) //ココだけ追加したよ

    try {
      // MongoDBではfindでデータを取得し、sortでソート
      const budgets = await Budget.find({ userId: req.user.id })
        .sort({ createdAt: -1 }) // -1はDESCと同じ意味
        .exec()

      res.json(budgets)
    } catch (error) {
      // console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }

  static create = async (req: Request, res: Response) => {
    // console.log('予算追加APIです /api/budgets');
    try {
      // MongoDBではcreateでデータを作成、その際にuserIdを同時に設定
      const budget = await Budget.create({
        ...req.body,
        userId: req.user.id,
        user: req.user.id, // 両方のフィールドに設定
      })

      res.status(201).json('予算が正しく作成されました')
    } catch (error) {
      // console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }

  static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const budgetId = req.params.budgetId // req.paramsからbudgetIdを取得

      // MongoDBではfindByIdでデータを取得し、populateで関連データを取得
      const budget = await Budget.findById(budgetId)
        .populate('expenses') // Expenseとのリレーションを取得
        .exec()

      if (!budget) {
        res.status(404).json({ error: '予算が見つかりません' })
        return
      }

      res.status(200).json(budget)
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static updateById = async (req: Request, res: Response) => {
    try {
      // Sequelizeと同様にreq.budgetを使う前提（ミドルウェアで設定）
      await Budget.findByIdAndUpdate(req.budget._id, req.body)
      res.json('予算の編集に成功しました')
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static deleteById = async (req: Request, res: Response) => {
    try {
      // Sequelizeと同様にreq.budgetを使う前提（ミドルウェアで設定）
      await Budget.findByIdAndDelete(req.budget._id)
      // 関連する支出も削除
      await Expense.deleteMany({ budgetId: req.budget._id })
      res.json('予算の削除に成功しました')
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }
}
