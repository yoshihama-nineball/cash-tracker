import type { Request, Response } from 'express';

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    console.log('予算の全表示APIです /api/budgets/id');
    res.status(200).send('予算の一覧全表示')
  }
    static create = async (req: Request, res: Response) => {
    console.log('予算追加APIです /api/budgets');
     res.status(200).send('予算の作成')
    
  }
      static getById = async (req: Request, res: Response) => {
    console.log('予算のID表示APIです /api/budgets/id');
     res.status(200).send('予算のID指定での表示')
  }
}