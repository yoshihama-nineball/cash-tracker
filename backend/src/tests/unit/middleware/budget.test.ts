import { validateBudgetExists } from './../../../middleware/budget';
import { createRequest, createResponse } from "node-mocks-http"
import Budget from "../../../models/Budget"
import { budgets } from '../../mocks/budgets';

jest.mock('../../../models/Budget.ts', () => ({
  findByPk: jest.fn(),
}))

describe('middleware- validateBudgetExists', () => {
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
    expect(data).toStrictEqual({ error: '予算が見つかりません' })
    expect(next).not.toHaveBeenCalled();
  })
  it('予算が存在する場合のミドルウェアテスト', async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])
    const req = createRequest({
      params: {
        budgetId: 1
      }
    })
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExists(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.budget).toEqual(budgets[0])
  })
})

describe('middleware - validateBudgetId', () => {
  it('予算が存在するかを検証するミドルウェア', async () => {
    const req = createRequest({
      params: {
        budgetId: 1
      }
    })
    const res = createResponse();
    const next = jest.fn();

    await validateBudgetExists(req, res, next)
    // const data = res._getJSONData();
  })
})

