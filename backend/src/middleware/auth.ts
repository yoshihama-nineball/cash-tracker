import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

// Requestインターフェースを拡張
declare global {
  namespace Express {
    interface Request {
      user?: any // MongoDBのユーザーオブジェクト
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    res.status(401).json({ error: '認証が必要です' })
    return
  }

  //MEMO: Bearer <JWT> の間のスペースを利用してJWTのみを取得
  const [, token] = bearer.split(' ')

  if (!token) {
    res.status(401).json({ error: 'トークンが存在しません' })
    return
  }

  try {
    //MEMO: 秘密鍵とJWTを用いて検証、JWTが有効であればデコードする
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //MEMO: デコードされたトークンがオブジェクトであり、idプロパティを持っていることを確認
    if (typeof decoded === 'object' && decoded.id) {
      // MongoDBのfindByIdを使用してユーザーを検索
      // 必要なフィールドだけを選択（パスワードは除外）
      req.user = await User.findById(decoded.id).select('_id name email')

      if (!req.user) {
        res.status(404).json({ error: 'ユーザーが見つかりません' })
        return
      }

      //MEMO: authRouterのuser
      //MEMO: authenticateの次にあるAuthController.userにreq.userを渡す
      next()
    } else {
      res.status(401).json({ error: 'トークンが無効です' })
    }
  } catch (error) {
    res.status(500).json({ error: 'トークンが無効です' })
  }
}
