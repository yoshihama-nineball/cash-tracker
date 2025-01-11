import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  //MEMO: 1分間あたりのリクエスト回数の上限を設定
  windowMs: 60 * 1000,
  // limit: process.env.NODE_ENV === 'production' ? 5 : 1000,
  limit: process.env.NODE_ENV === 'production' ? 5 : 100,
  message: { error: 'リクエストの上限に達しました' },
})
