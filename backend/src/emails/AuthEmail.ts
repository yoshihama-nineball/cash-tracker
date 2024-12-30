import { transport } from "../config/nodemailler"

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
        　　　　<p>CashTrackrにアカウントを作成しました。もう少しで完了です。</p>
                <p>次のリンクをクリックしてください:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">アカウントを確認する</a>
                <p>この認証コードを入力してください: <b>${user.token}</b></p>`
      });

      // メール送信の結果をログに出力
      console.log('メール送信結果:', email);
      console.log('メッセージID:', email.messageId);
      console.log('受信者:', email.envelope.to);
      console.log('送信者:', email.envelope.from);
      console.log('受理されたメールアドレス:', email.accepted);
      console.log('拒否されたメールアドレス:', email.rejected);
      console.log('保留中のメールアドレス:', email.pending);
      console.log('SMTPレスポンス:', email.response);
    } catch (error) {
      console.error('メール送信エラー:', error);
    }
  }
}