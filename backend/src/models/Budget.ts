import mongoose, { Document, Schema } from 'mongoose'
import { IExpense } from './Expense'
import { IUser } from './User'

// Budgetインターフェースの定義
export interface IBudget extends Document {
  name: string
  amount: number
  createdAt: Date
  updatedAt: Date
  expenses: IExpense['_id'][]
  userId: IUser['_id']
  user: IUser['_id']
}

// Budgetスキーマの定義
const budgetSchema = new Schema<IBudget>(
  {
    name: {
      type: String,
      required: [true, '予算名は必須です'],
      maxlength: [100, '予算名は100文字以内である必要があります'],
    },
    amount: {
      type: Number,
      required: [true, '金額は必須です'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // 仮想フィールドとしてuser参照を保持
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // createdAtとupdatedAtを自動生成
  },
)

// Expenseとの関連を処理する仮想フィールド
budgetSchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'budgetId',
})

// toJSONオプションを設定して仮想フィールドも出力されるようにする
budgetSchema.set('toJSON', { virtuals: true })
budgetSchema.set('toObject', { virtuals: true })

// Mongooseの保存前処理: userIdをuserにコピー
budgetSchema.pre('save', function (next) {
  if (this.userId) {
    this.user = this.userId
  }
  next()
})

// Budgetモデルの作成とエクスポート
const Budget = mongoose.model<IBudget>('Budget', budgetSchema)

export default Budget
