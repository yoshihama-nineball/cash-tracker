import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateJWT = (id: string): string => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // 30日間有効
    // subject: id, // トークンの主題にID
  })
  return token
  // const payload = { id };
  // const secret = process.env.JWT_SECRET; // 環境変数からシークレットキーを取得
  // const options = { expiresIn: '1h' }; // トークンの有効期限を1時間に設定
  // return jwt.sign(payload, secret, options);
  // console.log(id);
}
