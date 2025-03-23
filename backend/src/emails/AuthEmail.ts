import { transport } from '../config/nodemailler'

type EmailType = {
  name: string
  email: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    try {
      const email = await transport.sendMail({
        from: 'CashTracker <noreply@example.com>',
        to: user.email,
        subject: 'CashTracker - アカウントの確認',
        html: `<p>こんにちは: ${user.name}さん！</p>
              <p>CashTrackerにアカウントを作成しました。もう少しで完了です。</p>
              <p>次のリンクをクリックしてください:</p>
              <p><a href="${process.env.FRONTEND_URL}/auth/confirm-account" target="_blank" rel="noopener noreferrer">アカウントを確認する</a></p>
              <p>リンクが機能しない場合は、以下のURLをブラウザに直接コピー＆ペーストしてください：</p>
              <p>${process.env.FRONTEND_URL}/auth/confirm-account</p>
              <p>この認証コードを入力してください: <b>${user.token}</b></p>`,
      })

      // メール送信の結果をログに出力
      console.log('メール送信結果:', email)
      console.log('メッセージID:', email.messageId)
      console.log('受信者:', email.envelope.to)
      console.log('送信者:', email.envelope.from)
      console.log('受理されたメールアドレス:', email.accepted)
      console.log('拒否されたメールアドレス:', email.rejected)
      console.log('保留中のメールアドレス:', email.pending)
      console.log('SMTPレスポンス:', email.response)
    } catch (error) {
      console.error('メール送信エラー:', error)
    }
  }
  static sendResetPasswordEmail = async (user: EmailType) => {
    try {
      const email = await transport.sendMail({
        from: 'CashTracker <noreply@example.com>',
        to: user.email,
        subject: 'CashTracker - パスワードのリセット',
        html: `<p>こんにちは: ${user.name}さん！パスワードのリセットを受け付けました</p>
        　　　　<p>パスワードの再設定用の認証コードを共有します。もう少しで設定完了です。</p>
                <p>次のリンクをクリックしてパスワードの再設定を行ってください:</p>
                <a href="${process.env.FRONTEND_URL}/auth/forgot-password">パスワードの再設定を行う</a>
                <p>この認証コードを入力してください: <b>${user.token}</b></p>`,
      })
      // メール送信の結果をログに出力
      console.log('メール送信結果:', email)
      console.log('メッセージID:', email.messageId)
      console.log('受信者:', email.envelope.to)
      console.log('送信者:', email.envelope.from)
      console.log('受理されたメールアドレス:', email.accepted)
      console.log('拒否されたメールアドレス:', email.rejected)
      console.log('保留中のメールアドレス:', email.pending)
      console.log('SMTPレスポンス:', email.response)
    } catch (error) {
      console.error('パスワードリセットメールの送信エラー:', error)
    }
  }
}
