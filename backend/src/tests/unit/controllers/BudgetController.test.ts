import { BudgetController } from '../../../controllers/BudgetController'
import { budgets } from '../../mocks/budgets'
import { createRequest, createResponse } from 'node-mocks-http'
import Budget from '../../../models/Budget'

//MEMO: BudgetモデルのfindAllメソッドをモック化している
jest.mock('../../../models/Budget.ts', () => ({
  findAll: jest.fn(),
}))


describe('BudgetController.getAll', () => {

  //MEMO: 各テストケースの前に毎回実行される
  beforeEach(() => {
    //MEMO: Budget.findAllメソッドをリセットする
    (Budget.findAll as jest.Mock).mockReset();
    //MEMO: 特定ユーザのIDの予算だけをフィルタリングする
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const filteredBudgets = budgets.filter(budget => budget.userId === options.where.userId);
      return Promise.resolve(filteredBudgets);
    })

  })
  it('ユーザID1を持つユーザは2つの予算のデータを取得できる', async () => {

    const req = createRequest({
      method: 'GET',
      url: '/api/budgets',
      user: { id: 1 },
    })
    const res = createResponse();

    console.log(req.user.id, 'ユーザID');


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
    const res = createResponse();

    console.log(req.user.id, 'ユーザID');


    //MEMO: BudgetController.getAllメソッドを実行し、
    //MEMO: res._getJSONData()で取得したJSONデータを確認する
    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    // console.log(data, 'モックデータの結果')

    expect(data).toHaveLength(1)
    expect(res.statusCode).toBe(200)
    expect(res.statusCode).not.toBe(404)
  })

})
