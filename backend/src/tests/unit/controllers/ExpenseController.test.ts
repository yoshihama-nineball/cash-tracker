import { createRequest, createResponse } from 'node-mocks-http';
import Expense from '../../../models/Expense';
import { ExpenseController } from '../../../controllers/ExpenseController';
import { expenses } from '../../mocks/expenses';

// モックの設定
// jest.mock('../../../models/Expense', () => ({
//   create: jest.fn(),

// }));
jest.mock('../../../models/Expense', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));


describe('ExpensesController.create', () => {
  it('新規支出の作成が成功するテスト', async () => {
    const expenseMock = {
      save: jest.fn().mockResolvedValue(true)
    };
    (Expense.create as jest.Mock).mockResolvedValue(expenseMock);

    const req = createRequest({
      method: 'POST',
      url: '/api/budgets/:budgetId/expenses',
      budget: { id: 1 },
      body: {
        name: 'Test Expense',
        amount: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const res = createResponse();

    await ExpenseController.create(req, res);

    const data = res._getJSONData();
    // console.log(data, '支出作成成功のdata結果');

    expect(res.statusCode).toBe(201);
    expect(expenseMock.save).toHaveBeenCalled();
    expect(expenseMock.save).toHaveBeenCalledTimes(1);
  });

  it('新規支出の作成が失敗するテスト', async () => {
    const expenseMock = {
      save: jest.fn().mockResolvedValue(true),
    };

    (Expense.create as jest.Mock).mockRejectedValue(new Error)

    const req = createRequest({
      method: 'POST',
      url: '/api/budgets/:budgetId/expenses',
      budget: { id: 1 },
      body: {
        name: '鬼滅の刃3巻',
        amount: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    })
    const res = createResponse()

    await ExpenseController.create(req, res)

    const data = res._getJSONData()
    // console.log('予算作成失敗時のログ', data);

    expect(res.statusCode).toBe(500);
    expect(data).toStrictEqual({ error: 'エラーが発生しました' })
    expect(expenseMock.save).not.toHaveBeenCalled()
    expect(Expense.create).toHaveBeenCalledWith(req.body)
  })

});

