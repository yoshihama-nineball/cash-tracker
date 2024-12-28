import type { Request, Response } from 'express';
import Budget from '../models/Budget';

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    console.log('予算の全表示APIです /api/budgets');
    console.log('Debug: getAll method called');
    res.status(200).send('予算の一覧全表示');
  };

  static create = async (req: Request, res: Response) => {
    // console.log('予算追加APIです /api/budgets');
    try {
      // console.log(req.body);
      const budget = new Budget(req.body)
      await budget.save();
      res.status(201).json('予算が正しく作成されました');
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "エラーが発生しました" });
    }
  };
  static getById = async (req: Request, res: Response) => {
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
