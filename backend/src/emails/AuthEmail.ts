import { transport } from "../config/nodemailler"

type EmailType = {
  name: string
  email: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    // const email = await transport.sendMail({
    //   from: 'CashTracker <admin@cashtracker.com>',
    //   to: user.email,
    //   subject: 'CashTracker - アカウントの確認',
    //   html: `<p>こんにちは: ${user.name}さん、CashTrackrにアカウントを作成しました。もう少しで完了です。</p>
    //             <p>次のリンクをクリックしてください:</p>
    //             <a href="${process.env.FRONTEND_URL}/auth/confirm-account">アカウントを確認する</a>
    //             <p>そして、このコードを入力してください: <b>${user.token}</b></p>`
    // })

    console.log('メール送信テスト',)
  }
}
