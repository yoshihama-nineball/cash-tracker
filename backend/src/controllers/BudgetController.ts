import type { Request, Response } from 'express';
import Budget from '../models/Budget';

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        // limit: 1,
        // TODO: 後ほど検索フィルタリング実装
        // where: {
        //   name: '食費'
        // }
      });
      res.json(budgets);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "エラーが発生しました" });
    }
  };

  static create = async (req: Request, res: Response) => {
    // console.log('予算追加APIです /api/budgets');
    try {
      const budget = new Budget(req.body)
      await budget.save();
      res.status(201).json('予算が正しく作成されました');
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "エラーが発生しました" });
    }
  };
  static getById = async (req: Request, res: Response) => {
    console.log(req.params.id);

    console.log('予算のID表示APIです /api/budgets/id');
    res.status(200).send('予算のID指定での表示');
  };
  static updateById = async (req: Request, res: Response) => {
    console.log('予算のIDを用いた編集APIです /api/budgets/id');
    res.status(200).send('予算のID指定での編集');
  };
  static deleteById = async (req: Request, res: Response) => {
    console.log('予算のIDを用いた削除APIです /api/budgets/id');
    res.status(200).send('予算のID指定での削除');
  };
}
