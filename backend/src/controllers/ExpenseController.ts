import Expense from "../models/Expense"
import { Request, Response } from "express"

export class ExpenseController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const expenses = await Expense.findAll({
        order: [['createdAt', 'DESC']],
        // limit: 1,
        // TODO: 後ほど検索フィルタリング実装
        // where: {
        //   name: '食費'
        // }
      })
      res.json(expenses)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }
  static create = async (req: Request, res: Response) => {
    // console.log('予算追加APIです /api/budgets');
    try {
      // const expense = new Expense(req.body)
      // await expense.save()
      res.status(201).json('支出が正しく作成されました')
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }
  static getById = async (req: Request, res: Response): Promise<void> => {
    // res.json(req.budget)
    res.status(201).json('支出のID表示に成功しました')
  }
  static updateById = async (req: Request, res: Response) => {
    // await req.budget.update(req.body)
    res.status(201).json('支出の編集に成功しました')
  }
  static deleteById = async (req: Request, res: Response) => {
    // await req.budget.destroy()
    // res.json('支出の削除に成功しました')
    res.status(201).json('支出の削除に成功しました');

  }
}