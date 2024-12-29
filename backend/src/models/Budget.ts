import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript'
import Expense from './Expense'
// import Expense from './Expense'
// import User from './User'

@Table({
  tableName: 'budgets',
  timestamps: true,
})
class Budget extends Model {
  //MEMO: nameがnull非許容でstring型であることを定義
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  declare amount: number

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date

  @HasMany(() => Expense, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare expenses: Expense[]

  // @ForeignKey(() => User)
  // declare userId: number

  // @BelongsTo(() => User)
  // declare user: User
}

export default Budget
