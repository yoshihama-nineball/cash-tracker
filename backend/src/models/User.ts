import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  AllowNull,
  Unique,
  Default,
} from 'sequelize-typescript'
import Expense from './Expense'
import Budget from './Budget'
// import Expense from './Expense'
// import User from './User'

@Table({
  tableName: 'users',
  timestamps: true,
})
class User extends Model {
  //MEMO: nameがnull非許容でstring型であることを定義
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare name: string

  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare password: string

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare email: string

  @Column({
    type: DataType.STRING(6),
  })
  declare token: string

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare confirmed: boolean

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

  @HasMany(() => Budget, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare budgets: Budget[]
}

export default Budget
