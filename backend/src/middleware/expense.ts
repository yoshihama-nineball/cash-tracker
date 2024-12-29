import { Request, Response, NextFunction } from 'express'
import { param, validationResult, body } from 'express-validator'
import Expense from '../models/Expense'

declare global {
  namespace Express {
    interface Request {
      expense?: Expense
    }
  }
}

export const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await param('expenseId')
    //MEMO: bail()を使うことで、不要なエラーメッセージをスキップする
    .isInt()
    .withMessage('IDの値が数字以外で無効です')
    .bail()
    .custom((value) => value > 0)
    .withMessage('IDがマイナスの値です')
    .run(req)

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export const validateExpenseInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await body('name').notEmpty().withMessage('支出タイトルは必須です').run(req)
  await body('amount')
    .notEmpty()
    .withMessage('支出金額は必須です')
    .isNumeric()
    .withMessage('支出金額の値が無効です')
    .bail()
    .custom((value) => value > 0)
    .withMessage('支出金額が0円未満です')
    .run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  next()
}

export const validateExpenseExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { expenseId } = req.params
    console.log(`Validating existence of expense with ID: ${expenseId}`) // デバッグログ

    const expense = await Expense.findByPk(expenseId)
    if (!expense) {
      const error = new Error('支出が見つかりません')
      console.log(`Expense with ID: ${expenseId} not found`) // デバッグログ
      res.status(404).json({ error: error.message })
      return
    }
    req.expense = expense
    console.log(`Expense found: ${JSON.stringify(expense)}`) // デバッグログ
    next()
  } catch (error) {
    console.log(`Error while validating expense: ${error.message}`) // デバッグログ
    res.status(500).json({ error: error.message })
  }
}

export const belongsToBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.budget.id !== req.expense.budgetId) {
    const error = new Error('支出が見つかりません')
    res.status(404).json({ error: error.message })
    return
  }
  next()
}
