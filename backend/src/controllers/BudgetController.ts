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
  static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (!budget) {
        const error = new Error('予算が見つかりません')
        res.status(404).json({ error: error.message });
        return;
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: "エラーが発生しました" });
    }
  };

  static updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (!budget) {
        const error = new Error('予算が見つかりません')
        res.status(404).json({ error: error.message });
        return;
      }
      await budget.update(req.body);
      res.json('予算の編集に成功しました');
    } catch (error) {
      res.status(500).json({ error: "エラーが発生しました" });
    }
  };
  static deleteById = async (req: Request, res: Response) => {
    console.log('予算のIDを用いた削除APIです /api/budgets/id');
    res.status(200).send('予算のID指定での削除');
  };
}
