import mongoose, { Document, Schema } from 'mongoose'
import { IBudget } from './Budget'

// Expenseインターフェースの定義
export interface IExpense extends Document {
  name: string
  amount: number
  createdAt: Date
  updatedAt: Date
  budgetId: IBudget['_id']
  budget: IBudget['_id']
}

// Expenseスキーマの定義
const expenseSchema = new Schema<IExpense>(
  {
    name: {
      type: String,
      required: [true, '支出名は必須です'],
      maxlength: [100, '支出名は100文字以内である必要があります'],
    },
    amount: {
      type: Number,
      required: [true, '金額は必須です'],
    },
    budgetId: {
      type: Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
    // 仮想フィールドとしてbudget参照を保持
    budget: {
      type: Schema.Types.ObjectId,
      ref: 'Budget',
      required: true,
    },
  },
  {
    timestamps: true, // createdAtとupdatedAtを自動生成
  },
)

// toJSONオプションを設定して仮想フィールドも出力されるようにする
expenseSchema.set('toJSON', { virtuals: true })
expenseSchema.set('toObject', { virtuals: true })

// Mongooseの保存前処理: budgetIdをbudgetにコピー
expenseSchema.pre('save', function (next) {
  if (this.budgetId) {
    this.budget = this.budgetId
  }
  next()
})

// Expenseモデルの作成とエクスポート
const Expense = mongoose.model<IExpense>('Expense', expenseSchema)

export default Expense
