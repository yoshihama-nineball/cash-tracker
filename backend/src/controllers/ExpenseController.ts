import Expense from '../models/Expense'
import { Request, Response } from 'express'

export class ExpenseController {
  // static getAll = async (req: Request, res: Response) => {
  //   try {
  //     //MEMO: 予算IDを取得し、whereの条件に加える
  //     const budgetId = req.params.budgetId
  //     const expenses = await Expense.findAll({
  //       order: [['createdAt', 'DESC']],
  //       // limit: 1,
  //       // TODO: 後ほど検索フィルタリング実装
  //       where: {
  //         budgetId,
  //       },
  //     })
  //     res.status(201).json(expenses)
  //   } catch (error) {
  //     // console.log(error)
  //     res.status(500).json({ error: 'エラーが発生しました' })
  //   }
  // }
  static create = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.create(req.body)
      //MEMO: budgetIdをカラムに追加
      expense.budgetId = req.budget.id
      await expense.save()
      res.status(201).json('支出が正しく作成されました')
    } catch (error) {
      // console.log(error)
      res.status(500).json({ error: 'エラーが発生しました' })
    }
  }
  static getById = async (req: Request, res: Response): Promise<void> => {
    res.json(req.expense)
  }
  static updateById = async (req: Request, res: Response) => {
    await req.expense.update(req.body);
    res.json('支出の編集に成功しました');
  }
  static deleteById = async (req: Request, res: Response) => {
    await req.expense.destroy()
    res.json('支出の削除に成功しました')
  }
}
