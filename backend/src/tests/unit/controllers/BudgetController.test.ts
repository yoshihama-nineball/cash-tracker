import { BudgetController } from '../../../controllers/BudgetController'
import { budgets } from '../../mocks/budgets'
import { createRequest, createResponse } from 'node-mocks-http'
import Budget from '../../../models/Budget'

//MEMO: BudgetモデルのfindAllメソッドをモック化している
jest.mock('../../../models/Budget.ts', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
}))

describe('BudgetController.getAll', () => {
  //MEMO: 各テストケースの前に毎回実行される
  beforeEach(() => {
    //MEMO: Budget.findAllメソッドをリセットする
    ;(Budget.findAll as jest.Mock).mockReset()
    //MEMO: 特定ユーザのIDの予算だけをフィルタリングする関数の呼び出し
    ;(Budget.findAll as jest.Mock).mockImplementation((options) => {
      const filteredBudgets = budgets.filter(
        (budget) => budget.userId === options.where.userId,
      )
      //MEMO: Promise.resolveによってmockResolvedValueと同じことをしている
      return Promise.resolve(filteredBudgets)
    })
  })
  it('ユーザID1を持つユーザは2つの予算のデータを取得できる', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets',
      user: { id: 1 },
    })
    const res = createResponse()

    // console.log(req.user.id, 'ユーザID');

    //MEMO: BudgetController.getAllメソッドを実行し、
    //MEMO: res._getJSONData()で取得したJSONデータを確認する
    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    // console.log(data, 'モックデータの結果')

    expect(data).toHaveLength(2)
    expect(res.statusCode).toBe(200)
    expect(res.statusCode).not.toBe(404)
  })

  it('ユーザID2を持つユーザは1つの予算のデータを取得できる', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets',
      user: { id: 2 },
    })
    const res = createResponse()

    // console.log(req.user.id, 'ユーザID');

    //MEMO: BudgetController.getAllメソッドを実行し、
    //MEMO: res._getJSONData()で取得したJSONデータを確認する
    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    // console.log(data, 'モックデータの結果')

    expect(data).toHaveLength(1)
    expect(res.statusCode).toBe(200)
    expect(res.statusCode).not.toBe(404)
  })

  it('エラーハンドリングのテスト', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets',
      user: { id: 100 },
    })
    const res = createResponse()

    //MEMO: Budget.findAllの結果を上書きし、mockRejectedValueを用いてエラーを返すようにしている
    ;(Budget.findAll as jest.Mock).mockRejectedValue(new Error())
    await BudgetController.getAll(req, res)

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toStrictEqual({ error: 'エラーが発生しました' })
  })
})

describe('BudgetController.create', () => {
  it('新しい予算が追加され、ステータスコード201が返されるテスト', async () => {
    const mockBudget = {
      save: jest.fn().mockResolvedValue(true),
    }
    ;(Budget.create as jest.Mock).mockResolvedValue(mockBudget)
    const req = createRequest({
      method: 'POST',
      url: '/api/budgets',
      user: { id: 2 },
      body: {
        name: '医療費',
        amount: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    const res = createResponse()

    await BudgetController.create(req, res)

    const data = res._getJSONData()
    console.log(data)

    expect(res.statusCode).toBe(201)
    expect(data).toBe('予算が正しく作成されました')
    expect(mockBudget.save).toHaveBeenCalled()
    expect(mockBudget.save).toHaveBeenCalledTimes(1)
    expect(Budget.create).toHaveBeenCalledWith(req.body)
  })

  it('予算作成時のエラーハンドリングのテスト', async () => {
    const mockBudget = {
      save: jest.fn(),
    }
    ;(Budget.create as jest.Mock).mockRejectedValue(new Error())
    const req = createRequest({
      method: 'POST',
      url: '/api/budgets',
      user: { id: 2 },
      body: {
        name: '医療費',
        amount: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    const res = createResponse()

    //MEMO: Budget.findAllの結果を上書きし、mockRejectedValueを用いてエラーを返すようにしている
    ;(Budget.create as jest.Mock).mockRejectedValue(new Error())
    await BudgetController.create(req, res)

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toStrictEqual({ error: 'エラーが発生しました' })
    expect(mockBudget.save).not.toHaveBeenCalled()
    expect(Budget.create).toHaveBeenCalledWith(req.body)
  })
})
