import { NextFunction, Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import mongoose from 'mongoose'
import Expense from '../models/Expense'

// Requestインターフェースを拡張
declare global {
  namespace Express {
    interface Request {
      expense?: any // Expense型をanyに変更
    }
  }
}

export const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await param('expenseId')
    // MongoDBのIDはObjectIDなので、数値ではなく正しい形式かチェック
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('無効なID形式です')
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

    // ObjectIDの形式チェック
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      res.status(400).json({ error: '無効なID形式です' })
      return
    }

    // findByPkをfindByIdに変更
    const expense = await Expense.findById(expenseId)

    if (!expense) {
      const error = new Error('支出が見つかりません')
      // console.log(`Expense with ID: ${expenseId} not found`) // デバッグログ
      res.status(404).json({ error: error.message })
      return
    }
    req.expense = expense
    // console.log(`Expense found: ${JSON.stringify(expense)}`) // デバッグログ
    next()
  } catch (error) {
    // console.log(`Error while validating expense: ${error.message}`) // デバッグログ
    res.status(500).json({ error: error.message })
  }
}

export const belongsToBudget = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // MongoDBのIDはオブジェクトなので、文字列に変換して比較
  if (req.budget._id.toString() !== req.expense.budgetId.toString()) {
    const error = new Error('支出が見つかりません')
    res.status(404).json({ error: error.message })
    return
  }
  next()
}
