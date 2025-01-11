import { BudgetController } from '../../../controllers/BudgetController'
import { budgets } from '../../mocks/budgets'
import { createRequest, createResponse } from 'node-mocks-http'
import Budget from '../../../models/Budget'
import Expense from '../../../models/Expense'

//MEMO: BudgetモデルのfindAllメソッドをモック化している
jest.mock('../../../models/Budget.ts', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
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

    // // console.log(req.user.id, 'ユーザID');

    //MEMO: BudgetController.getAllメソッドを実行し、
    //MEMO: res._getJSONData()で取得したJSONデータを確認する
    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    // // console.log(data, 'モックデータの結果')

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

    // // console.log(req.user.id, 'ユーザID');

    //MEMO: BudgetController.getAllメソッドを実行し、
    //MEMO: res._getJSONData()で取得したJSONデータを確認する
    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    // // console.log(data, 'モックデータの結果')

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
    // // console.log(data)

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
describe('BudgetController.getById', () => {
  beforeEach(() => {
    ;(Budget.findByPk as jest.Mock).mockImplementation((id, include) => {
      const budget = budgets.find((b) => b.id === id)
      return Promise.resolve(budget)
    })
  })

  it('ユーザIDが1で予算IDが1の支出データは3つ取得できるはず', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId',
      params: { budgetId: 1 },
    })
    const res = createResponse()
    await BudgetController.getById(req, res)

    const data = res._getJSONData()
    // console.log(data, 'IDによる予算取得データ');

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(3)
    expect(Budget.findByPk).toHaveBeenCalled()
    // expect(Budget.findByPk).toHaveBeenCalledWith(1);
  })

  it('ユーザIDが1で予算IDが2の支出データは2つ取得できるはず', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId',
      params: { budgetId: 2 },
    })
    const res = createResponse()
    await BudgetController.getById(req, res)

    const data = res._getJSONData()
    // console.log(data, 'IDによる予算取得データ');

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(2)
    expect(Budget.findByPk).toHaveBeenCalled()
  })

  it('ユーザIDが1で予算IDが3の支出データは0個取得できるはず', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId',
      params: { budgetId: 3 },
    })
    const res = createResponse()
    await BudgetController.getById(req, res)

    const data = res._getJSONData()
    // console.log(data, 'IDによる予算取得データ');

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(0)
    expect(Budget.findByPk).toHaveBeenCalled()
  })

  it('ユーザIDが1で予算IDが3の支出データは0個取得できるはず', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId',
      params: { budgetId: 3 },
    })
    const res = createResponse()
    ;(Budget.findByPk as jest.Mock).mockRejectedValue(new Error())
    await BudgetController.getById(req, res)

    const data = res._getJSONData()
    // console.log(data, 'IDによる予算取得データでのエラーハンドリング');

    expect(res.statusCode).toBe(500)
    expect(Budget.findByPk).toHaveBeenCalled()
  })

  it('ユーザIDが1で予算IDが3の支出データは0個取得できるはず', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId',
      params: { budgetId: 3 },
    })
    const res = createResponse()
    ;(Budget.findByPk as jest.Mock).mockResolvedValue(undefined)
    await BudgetController.getById(req, res)

    const data = res._getJSONData()
    // console.log(data, 'IDによる予算取得データでIDが見つからない場合のテスト');

    expect(res.statusCode).toBe(404)
    expect(Budget.findByPk).toHaveBeenCalled()
  })
})

describe('BudgetController.updateById', () => {
  it('予算の更新と成功した胸のメッセージ', async () => {
    const mockBudget = {
      ...budgets[0],
      update: jest.fn().mockResolvedValue(true),
    }
    const req = createRequest({
      method: 'POST',
      url: '/api/budgets/:budgetId',
      budget: mockBudget,
      body: {
        name: '医療費',
        amount: 10000,
        // createdAt: new Date(),
        // updatedAt: new Date(),
      },
    })
    const res = createResponse()
    await BudgetController.updateById(req, res)
    const data = res._getJSONData()
    // console.log(data);

    expect(res.statusCode).toBe(200)
    expect(data).toBe('予算の編集に成功しました')
    expect(mockBudget.update).toHaveBeenCalled()
    expect(mockBudget.update).toHaveBeenCalledTimes(1)
  })
})

describe('BudgetController.deleteById', () => {
  it('予算の削除と成功した旨のメッセージ', async () => {
    const mockBudget = {
      ...budgets[0],
      destroy: jest.fn().mockResolvedValue(true),
    }
    const req = createRequest({
      method: 'DELETE',
      url: '/api/budgets/:budgetId',
      budget: mockBudget,
      // body: {
      //   name: '医療費',
      //   amount: 10000,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    })
    const res = createResponse()
    await BudgetController.deleteById(req, res)
    const data = res._getJSONData()
    // console.log(data);

    expect(res.statusCode).toBe(200)
    expect(data).toBe('予算の削除に成功しました')
    expect(mockBudget.destroy).toHaveBeenCalled()
    expect(mockBudget.destroy).toHaveBeenCalledTimes(1)
  })
})
