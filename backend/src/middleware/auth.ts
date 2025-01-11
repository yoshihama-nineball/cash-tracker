import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import User from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user?: User
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

  //MEMO: sBearer <JWT> の間のスペースを利用してJWTのみを取得
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
      // MEMO: 秘密鍵とJWTを用いて検証、JWTが有効であればデコードする
      req.user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email'],
      })
      //MEMO: authRouterのuser
      //MEMO: authenticateの次にあるAuthController.userにreq.userを渡す
      next()
    }
  } catch (error) {
    res.status(500).json({ error: 'トークンが無効です' })
  }
}
