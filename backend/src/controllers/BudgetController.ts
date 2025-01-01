import type { Request, Response } from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense'

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    // console.log('mockの結果', req.user.id) //ココだけ追加したよ

    try {
      const budgets = await Budget.findAll({
        order: [['createdAt', 'DESC']],
        // limit: 1,
        // TODO: 後ほど検索フィルタリング実装
        where: {
          userId: req.user.id,
        },
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
      const budget = new Budget(req.body)
      //MEMO: JWT認証によって得たユーザIDをBudgetテーブルのuserIdに追加
      budget.userId = req.user.id
      await budget.save()
      res.status(201).json('予算が正しく作成されました')
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }
  static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const budget = await Budget.findByPk(req.budget.id, {
        include: [Expense],
      })

      if (!budget) {
        res.status(404).json({ error: '予算が見つかりません' })
        return
      }

      if (budget.userId !== req.user.id) {
        res.status(401).json({ error: 'アクセス権限がありません' })
        return
      }

      res.json({
        budget: budget,
        user: req.user,
      })
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static updateById = async (req: Request, res: Response) => {
    await req.budget.update(req.body)
    res.json('予算の編集に成功しました')
  }
  static deleteById = async (req: Request, res: Response) => {
    await req.budget.destroy()
    res.json('予算の削除に成功しました')
  }
}
