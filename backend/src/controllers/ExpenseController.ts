import Expense from "../models/Expense"
import { Request, Response } from "express"

export class ExpenseController {
  static getAll = async (req: Request, res: Response) => {
    try {
      //MEMO: 予算IDを取得し、whereの条件に加える
      const budgetId = req.params.budgetId
      const expenses = await Expense.findAll({
        order: [['createdAt', 'DESC']],
        // limit: 1,
        // TODO: 後ほど検索フィルタリング実装
        where: {
          budgetId
        }
      })
      res.json(expenses)
      // res.status(200).json("全件取得しました")
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }
  static create = async (req: Request, res: Response) => {
    // console.log('予算追加APIです /id/expenses');
    try {
      const expense = new Expense(req.body)
      //MEMO: budgetIdをカラムに追加
      expense.budgetId = req.budget.id;
      await expense.save()
      res.status(201).json('支出が正しく作成されました')
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }
  static getById = async (req: Request, res: Response): Promise<void> => {
    res.json(req.expense);
    // res.status(201).json('支出のID表示に成功しました')
  }
  static updateById = async (req: Request, res: Response) => {
    // await req.budget.update(req.body)
    res.status(201).json('支出の編集に成功しました')
  }
  static deleteById = async (req: Request, res: Response) => {
    // await req.expense.destroy()
    // res.json('支出の削除に成功しました')
    res.status(201).json('支出の削除に成功しました');

  }
}