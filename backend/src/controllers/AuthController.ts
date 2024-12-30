import { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { checkPassword, generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'

export class AuthController {
  static createAccount = async (req: Request, res: Response): Promise<void> => {
    // res.json(req.body)
    const { email, password } = req.body
    const userExists = await User.findOne({ where: { email } })
    if (userExists) {
      const error = new Error('そのメールアドレスは既に登録されています。')
      //MEMO: 競合がある場合、409エラーを使用する
      res.status(409).json({ error: error.message })
    }
    try {
      const user = new User(req.body)
      user.password = await hashPassword(password)
      const token = generateToken()
      user.token = token

      // if(process.env.NODE_ENV !== 'production') {
      //   globalThis.cashTrackerConfirmationToken = token
      // }

      await user.save()
      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      })
      // res.status(201).json({ message: 'アカウントを作成しました' });
      res.status(201).json({
        message: 'アカウントを作成しました',
        email: { to: user.email, token: user.token },
      })
      // res.status(200).json(user)
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: 'ユーザ作成中にエラーが発生しました' })
    }
  }

  static confirmAccount = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { token } = req.body
    const user = await User.findOne({ where: { token } })
    // res.json(user)
    // console.log(user)

    if (!user) {
      const error = new Error('認証コードが無効です')
      res.status(401).json({ error: error.message })
    }
    //MEMO:MEMO: confirmedをtrueにすることで、ユーザ登録を完了する
    user.confirmed = true
    //MEMO: アカウントの確認用tokenを無効にする
    user.token = null
    await user.save()
    res.json('アカウントの認証に成功しました！')
  }

  static login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        res.status(401).json({ error: 'ユーザが見つかりません' })
        return // 関数を終了させる
      }

      if (!user.confirmed) {
        res
          .status(401)
          .json({
            error:
              'アカウントがまだ有効化されていません。メールに送信された認証コードを使用してアカウントを有効化してください',
          })
        return // 関数を終了させる
      }

      const isPasswordCorrect = await checkPassword(password, user.password)
      // console.log('Password correct:', isPasswordCorrect);
      if (!isPasswordCorrect) {
        res.status(401).json({ error: 'パスワードが間違っています' })
        return // 関数を終了させる
      }

      // JWTの生成
      const token = generateJWT(user.id)
      res.json({ message: 'アカウントのログインに成功しました！', token })
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static forgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {}

  static validateToken = async (
    req: Request,
    res: Response,
  ): Promise<void> => {}

  static resetPasswordWithToken = async (
    req: Request,
    res: Response,
  ): Promise<void> => {}

  static user = async (req: Request, res: Response): Promise<void> => {}

  static updateCurrentUserPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {}

  static checkPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {}

  static updateUser = async (req: Request, res: Response): Promise<void> => {}
}
