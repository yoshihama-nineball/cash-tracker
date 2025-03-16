import { NextFunction, Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import mongoose from 'mongoose'
import Budget from '../models/Budget'

// Requestインターフェースを拡張
declare global {
  namespace Express {
    interface Request {
      budget?: any // Budget型をanyに変更
    }
  }
}

export const validateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await param('budgetId')
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

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await body('name').notEmpty().withMessage('予算タイトルは必須です').run(req)
  await body('amount')
    .notEmpty()
    .withMessage('予算金額は必須です')
    .isNumeric()
    .withMessage('予算金額の値が無効です')
    .bail()
    .custom((value) => value > 0)
    .withMessage('予算金額が0円未満です')
    .run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  next()
}

export const validateBudgetExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { budgetId } = req.params

    // ObjectIDの形式チェック
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      res.status(400).json({ error: '無効なID形式です' })
      return
    }

    // findByPkをfindByIdに変更
    const budget = await Budget.findById(budgetId)

    if (!budget) {
      const error = new Error('予算が見つかりません')
      res.status(404).json({ error: error.message })
      return
    }
    req.budget = budget
    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export function hasAccess(req: Request, res: Response, next: NextFunction) {
  // MongoDBのIDはオブジェクトなので、文字列に変換して比較
  if (req.budget.userId.toString() !== req.user.id.toString()) {
    return res.status(401).json({ error: 'このURLでのアクセス権はありません' })
  }
  next()
}
