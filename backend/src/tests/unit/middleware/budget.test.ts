import { validateBudgetExists } from './../../../middleware/budget';
import { createRequest, createResponse } from "node-mocks-http"
import Budget from "../../../models/Budget"

jest.mock('../../../models/Budget.ts', () => ({
  findByPk: jest.fn(),
}))

describe('validateBudgetInput', () => {
  it('予算が存在しない場合のミドルウェアテスト', async () => {
    // console.log('予算がない場合のミドルウェアテスト log ');
    (Budget.findByPk as jest.Mock).mockResolvedValue(null)
    const req = createRequest({
      params: {
        budgetId: 1
      }
    })
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExists(req, res, next)
    const data = res._getJSONData();
    expect(res.statusCode).toBe(404)
    expect(Budget.findByPk).toHaveBeenCalled();
  })
})