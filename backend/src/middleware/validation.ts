import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

// handleInputErrorsミドルウェア関数の定義
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req) // バリデーションの結果を取得
  if (!errors.isEmpty()) {
    // エラーがあれば
    res.status(400).json({ errors: errors.array() }) // エラー内容をレスポンスとして返す
  } else {
    next() // エラーがなければ次のミドルウェアまたはルートハンドラーに処理を渡す
  }
}
