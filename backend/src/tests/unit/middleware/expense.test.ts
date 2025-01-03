import { createRequest, createResponse } from "node-mocks-http"
import Expense from "../../../models/Expense"
import { expenses } from "../../mocks/expenses"
import { validateExpenseExists } from "../../../middleware/expense"
import { budgets } from "../../mocks/budgets"
import { hasAccess } from "../../../middleware/budget"

jest.mock('../../../models/Expense.ts', () => ({
  findByPk: jest.fn(),
}))

describe('middleware - validateExpenseExists', () => {
  beforeEach(() => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      const expense = expenses.filter(e => e.id === id)[0] ?? null;
      return Promise.resolve(expense);
    })
  })
  it('支出が存在しない場合のミドルウェアテスト', async () => {
    (Expense.findByPk as jest.Mock).mockResolvedValue(undefined);
    console.log('支出が存在しない場合のミドルウェアテストlog');
    const req = createRequest({
      params: {
        expenseId: 1
      }
    })
    const res = createResponse();
    const next = jest.fn();

    await validateExpenseExists(req, res, next)
    const data = res._getJSONData();
    expect(res.statusCode).toBe(404)
    expect(data).toStrictEqual({ error: '支出が見つかりません' })
    expect(next).not.toHaveBeenCalled();

  })
  it('支出が存在する場合のミドルウェアテスト', async () => {
    const req = createRequest({
      params: {
        expenseId: 1
      }
    })
    const res = createResponse();
    const next = jest.fn();

    await validateExpenseExists(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(next).toHaveBeenCalled();
    expect(req.expense).toEqual(expenses[0])

  })
  it('支出のデータ取得で予期しないエラーが起きたときのミドルウェアテスト', async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue(new Error);
    const req = createRequest({
      params: {
        expenseId: 1
      }
    })
    const res = createResponse();
    const next = jest.fn();

    await validateExpenseExists(req, res, next)

    expect(res.statusCode).toBe(500);
    expect(next).not.toHaveBeenCalled();
  })
})

describe('middleware - hasAccess', () => {
  beforeEach(() => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      const expense = expenses.filter(e => e.id === id)[0] ?? null;
      return Promise.resolve(expense);
    })
  })

  it('アクセス権がある場合のテスト', () => {
    // (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
    const req = createRequest({
      method: 'POST',
      url: '/api/budgets/:budgetId/expenses',
      budget: { userId: 1 },
      user: { id: 1 },
      body: {
        name: 'Test Expense',
        amount: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const res = createResponse();
    const next = jest.fn();

    hasAccess(req, res, next)
    const data = res._getJSONData();

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled()
    expect(data).toStrictEqual({ error: 'このURLでのアクセス権はありません' })
  })
  it('アクセス権がある場合の検証テスト', () => {
    const req = createRequest({
      budget: { userId: 2 },
      user: { id: 2 }
    })
    const res = createResponse();
    const next = jest.fn();

    hasAccess(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })
})