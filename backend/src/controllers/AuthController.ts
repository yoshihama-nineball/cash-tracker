import type { Request, Response } from 'express'
import { AuthEmail } from '../emails/AuthEmail'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import { checkPassword, generateToken } from '../utils/token'

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    // res.json(req.body)
    const { email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      const error = new Error('そのメールアドレスは既に登録されています。')
      //MEMO: 競合がある場合、409エラーを使用する
      res.status(409).json({ error: error.message })
      return
    }
    try {
      // ハッシュ化のコードを削除
      const token = generateToken()

      if (process.env.NODE_ENV !== 'production') {
        globalThis.cashTrackerConfirmation = token
      }

      // 直接パスワードを渡す（ハッシュ化はモデルのフックで行われる）
      const user = await User.create({
        ...req.body,
        // password: hashedPassword,  <- この行を削除
        token: token,
      })

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      })

      // 残りの処理はそのまま...
      res.status(201).json({
        message: 'アカウントを作成しました',
        email: { to: user.email, token: user.token },
      })
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
    const user = await User.findOne({ token })
    // res.json(user)
    // console.log(user)

    if (!user) {
      const error = new Error('認証コードが無効です')
      res.status(401).json({ error: error.message })
      return
    }
    //MEMO:MEMO: confirmedをtrueにすることで、ユーザ登録を完了する
    // MongoDBの場合は直接更新
    await User.findByIdAndUpdate(user._id, {
      confirmed: true,
      token: null, // アカウントの確認用tokenを無効にする
    })

    res.json('アカウントの認証に成功しました！')
  }

  static login = async (req: Request, res: Response): Promise<void> => {
    console.log('===== ログイン処理開始 =====')
    console.log('リクエストボディ:', req.body)

    const { email, password } = req.body

    try {
      console.log(`${email} のユーザーを検索中...`)
      const user = await User.findOne({ email })
      console.log(
        '検索結果:',
        user ? 'ユーザーが見つかりました' : 'ユーザーが見つかりませんでした',
      )

      if (!user) {
        console.log('ユーザーが存在しないためログイン失敗')
        res.status(401).json({ error: 'ユーザが見つかりません' })
        return
      }

      console.log('アカウント確認状態:', user.confirmed ? '確認済み' : '未確認')
      if (!user.confirmed) {
        console.log('アカウントが未確認のためログイン失敗')
        res.status(401).json({
          error:
            'アカウントがまだ有効化されていません。メールに送信された認証コードを使用してアカウントを有効化してください',
        })
        return
      }

      console.log('パスワードチェック実行...')
      // パスワードのハッシュ値を表示（注意: 本番環境では削除すること）
      console.log(
        '保存されているハッシュ値:',
        user.password ? user.password.substring(0, 10) + '...' : 'なし',
      )

      const isPasswordCorrect = await checkPassword(password, user.password)
      console.log(
        'パスワードチェック結果:',
        isPasswordCorrect ? '成功' : '失敗',
      )

      if (!isPasswordCorrect) {
        console.log('パスワードが一致しないためログイン失敗')
        res.status(401).json({ error: 'パスワードが間違っています' })
        return
      }

      console.log('ログイン成功、JWTトークン生成...')
      const token = generateJWT(user._id.toString())
      console.log('トークン生成完了:', token ? '成功' : '失敗')
      console.log(token, 'トークンテスト/backend')

      // res
      //   .status(200)
      //   .json({ message: 'アカウントのログインに成功しました！', token })
      res.json(token)
      console.log('===== ログイン処理完了 =====')
    } catch (error) {
      console.error('ログイン処理中にエラー発生:', error)
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static forgotPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ error: 'ユーザが見つかりません' })
      return
    }

    const token = generateToken()
    await User.findByIdAndUpdate(user._id, { token })

    // MEMO: 一時退避
    await AuthEmail.sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: user.token,
    })
    res.status(201).json({
      message: 'パスワードをリセットしました。メールを確認してください',
      email: { to: user.email, token },
    })
  }

  static validateToken = async (req: Request, res: Response): Promise<void> => {
    //TODO: パスワードリセット時に生成したtokenが有効か確認する
    const { token } = req.body

    // トークンがない場合
    if (!token) {
      res.status(400).json({ error: 'トークンが提供されていません' })
      return
    }

    try {
      const user = await User.findOne({ token })
      if (!user) {
        // ステータスコードを409に変更（クライアント側のエラーハンドリングに合わせる）
        res.status(409).json({ error: 'トークンが無効です' })
        return
      }

      // 成功レスポンスの形式も一貫性を持たせる
      res.status(200).json({
        success: '有効なトークンです。新しいパスワードを設定してください。',
      })
    } catch (error) {
      console.error('トークン検証エラー:', error)
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static resetPasswordWithToken = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { token } = req.params
    const { password } = req.body

    try {
      const user = await User.findOne({ token })

      if (!user) {
        res.status(401).json({ error: 'ユーザが見つかりません' })
        return
      }

      // パスワードの再設定時も、ハッシュ化して登録する
      const hashedPassword = await hashPassword(password)

      // 認証コード用のtokenが正しいことが確認出来たら、tokenをnullにして無効にする
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        token: null,
      })

      res.status(200).json({ message: 'パスワードが更新されました' })
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static user = async (req: Request, res: Response): Promise<void> => {
    res.json(req.user)
  }

  static updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
      })

      if (!updatedUser) {
        res.status(404).json({ message: 'ユーザーが見つかりません' })
        return
      }

      res.status(200).json({
        message: 'プロフィールが更新されました',
        user: updatedUser,
      })
    } catch (error) {
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static updateCurrentUserPassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { current_password, password } = req.body
      const { id } = req.user
      const user = await User.findById(id)

      if (!user) {
        res.status(404).json({ error: 'ユーザーが見つかりません' })
        return
      }

      //MEMO: IDから取得したユーザのパスワードと、current_passwordが一致するか確認
      const isCheckPasswordCorrect = await checkPassword(
        current_password,
        user.password,
      )
      if (!isCheckPasswordCorrect) {
        res.status(401).json({ error: '現在のパスワードが間違っています' })
        return
      }
      //MEMO: 現在のパスワードの入力が正しい場合、再設定したパスワードを保存
      const hashedPassword = await hashPassword(password)
      await User.findByIdAndUpdate(id, { password: hashedPassword })

      res.status(200).json({ message: 'パスワードが更新されました' })
    } catch (error) {
      console.error('Password update error:', error)
      res.status(500).json({ error: 'サーバーエラーが発生しました' })
    }
  }

  static checkPassword = async (req: Request, res: Response): Promise<void> => {
    const { password } = req.body
    const { id } = req.user

    const user = await User.findById(id)

    const isCorrectPassword = await checkPassword(password, user.password)
    if (!isCorrectPassword) {
      res.status(401).json({ error: 'パスワードが間違っています' })
      return
    }
    res.status(201).json({ message: 'パスワードは正しいです' })
  }
}
