import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import Budget from '../models/Budget';

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
  await param('budgetId')
    //MEMO: bail()を使うことで、不要なエラーメッセージをスキップする
    .isInt().withMessage('IDの値が数字以外で無効です').bail()
    .custom(value => value > 0).withMessage('IDがマイナスの値です')
    .run(req)

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}


export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await body('name')
    .notEmpty()
    .withMessage('予算タイトルは必須です')
    .run(req);
  await body('amount')
    .notEmpty()
    .withMessage('予算金額は必須です')
    .isNumeric()
    .withMessage('予算金額の値が無効です').bail()
    .custom((value) => value > 0)
    .withMessage('予算金額が0円未満です')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      const error = new Error('予算が見つかりません');
      res.status(404).json({ error: error.message });
      return;
    }
    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
