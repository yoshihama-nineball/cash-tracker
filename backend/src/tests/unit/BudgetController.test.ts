import { BudgetController } from './../../controllers/BudgetController';
import { budgets } from "../mocks/budgets"
import { createRequest, createResponse } from 'node-mocks-http'

describe('BudgetController.getAll', () => {
  it('3つの予算の取得', async () => {
    // expect(budgets).toHaveLength(3)
    // //MEMO: 空データではないことを確認するテストコード
    // expect(budgets).not.toHaveLength(0)

    const req = createRequest({
      method: 'GET',
      url: '/api/budgets',
      user: { id: 500 }
    })

    const res = createResponse()

    await BudgetController.getAll(req, res)
    console.log(res._getJSONData);

  })
})

