import bcryptjs from 'bcryptjs'
import mongoose, { Document, Schema } from 'mongoose'
import { IBudget } from './Budget'

// Userインターフェースの定義
export interface IUser extends Document {
  name: string
  password: string
  email: string
  token?: string
  confirmed: boolean
  createdAt: Date
  updatedAt: Date
  budgets: IBudget['_id'][]
  matchPassword(enteredPassword: string): Promise<boolean>
}

// Userスキーマの定義
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, '名前は必須です'],
      maxlength: [50, '名前は50文字以内である必要があります'],
    },
    password: {
      type: String,
      required: [true, 'パスワードは必須です'],
      maxlength: [60, 'パスワードは60文字以内である必要があります'],
    },
    email: {
      type: String,
      required: [true, 'メールアドレスは必須です'],
      unique: true,
      maxlength: [50, 'メールアドレスは50文字以内である必要があります'],
      match: [/^\S+@\S+\.\S+$/, 'メールアドレスの形式が正しくありません'],
    },
    token: {
      type: String,
      maxlength: [6, 'トークンは6文字以内である必要があります'],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAtとupdatedAtを自動生成
  },
)

// Budgetsとの関連を処理する仮想フィールド
userSchema.virtual('budgets', {
  ref: 'Budget',
  localField: '_id',
  foreignField: 'userId',
})

// toJSONオプションを設定して仮想フィールドも出力されるようにする
userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

// パスワードのハッシュ化
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
  next()
})

// パスワード検証メソッド
userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password)
}

// Userモデルの作成とエクスポート
const User = mongoose.model<IUser>('User', userSchema)

export default User
