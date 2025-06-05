import type { Request, Response } from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense'

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    // console.log('mockの結果', req.user.id) //ココだけ追加したよ

    try {
      // MongoDBではfindでデータを取得し、sortでソート
      const budgets = await Budget.find({ userId: req.user.id })
        .populate('expenses') // ← この行を追加
        .sort({ createdAt: -1 }) // -1はDESCと同じ意味
        .exec()

      // デバッグログを追加（一時的）
      console.log('=== Budget getAll Debug ===')
      budgets.forEach((budget, index) => {
        console.log(`Budget ${index + 1}: ${budget.name}`)
        console.log(`Expenses count: ${budget.expenses?.length || 0}`)
      })

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
      const budgetId = req.params.budgetId

      const budget = await Budget.findById(budgetId).populate('expenses').exec()

      // デバッグログを追加
      console.log('=== Budget getById Debug ===')
      console.log('Budget ID:', budgetId)
      console.log('Budget found:', !!budget)
      console.log('Budget expenses field:', budget?.expenses)
      console.log('Expenses count:', budget?.expenses?.length || 0)
      console.log('Raw budget object:', JSON.stringify(budget, null, 2))

      if (!budget) {
        res.status(404).json({ error: '予算が見つかりません' })
        return
      }

      res.status(200).json(budget)
    } catch (error) {
      console.error('Budget getById error:', error)
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
