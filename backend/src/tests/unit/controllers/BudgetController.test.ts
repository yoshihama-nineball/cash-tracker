import { BudgetController } from '../../../controllers/BudgetController'
import { budgets } from '../../mocks/budgets'
import { createRequest, createResponse } from 'node-mocks-http'
import Budget from '../../../models/Budget'

//MEMO: BudgetモデルのfindAllメソッドをモック化している
jest.mock('../../../models/Budget.ts', () => ({
  findAll: jest.fn(),
}))


describe('BudgetController.getAll', () => {
  it('ユーザID1を持つユーザは2つの予算のデータを取得できる', async () => {
    // expect(budgets).toHaveLength(3)
    // //MEMO: 空データではないことを確認するテストコード
    // expect(budgets).not.toHaveLength(0)

    const req = createRequest({
      method: 'GET',
      url: '/api/budgets',
      user: { id: 1 },
    })
    const res = createResponse();

    console.log(req.user.id, 'ユーザID');


    const filteredBudgets = budgets.filter(budget => budget.userId === req.user.id);

    //MEMO: findAllメソッドをモック化し、budgetsモックデータを返していることを確認する
    (Budget.findAll as jest.Mock).mockResolvedValue(filteredBudgets);

    //MEMO: BudgetController.getAllメソッドを実行し、
    //MEMO: res._getJSONData()で取得したJSONデータを確認する
    await BudgetController.getAll(req, res)

    const data = res._getJSONData()
    // console.log(data, 'モックデータの結果')

    expect(data).toHaveLength(2)
    expect(res.statusCode).toBe(200)
    expect(res.statusCode).not.toBe(404)
  })
})
