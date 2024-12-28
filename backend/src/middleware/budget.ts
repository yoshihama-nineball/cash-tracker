import { Request, Response, NextFunction } from "express"
import { param, validationResult } from "express-validator"

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
  await param('id')
    .isInt()
    .withMessage('IDが正しくありません')
    .custom((value) => value > 0)
    .withMessage('IDの値がマイナスです')
    .run(req)

  const errors = validationResult(req) // バリデーションの結果を取得
  if (!errors.isEmpty()) {
    // エラーがあれば
    await res.status(400).json({ errors: errors.array() }) // エラー内容をレスポンスとして返す
  }
  next()
}