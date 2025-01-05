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

describe('ExpenseController.getById', () => {
  it('IDによる支出取得', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId/expenses/:expenseId',
      expense: expenses[0]
    });
    const res = createResponse();
    await ExpenseController.getById(req, res);

    const data = res._getJSONData();
    // console.log(data, 'IDによる支出取得データ');

    expect(res.statusCode).toBe(200);
    expect(data).toEqual(expenses[0]);
  });

})

describe('ExpenseController.updateById', () => {
  it('支出の更新と成功した旨のメッセージ', async () => {
    const mockExpense = {
      ...expenses[0],
      update: jest.fn().mockResolvedValue(true),
    }
    const req = createRequest({
      method: 'PUT',
      url: '/api/budgets/:budgetId/expenses/:expenseId',
      expense: mockExpense,
      body: {
        name: '医療費',
        amount: 10000,
      },
    })
    const res = createResponse()
    await ExpenseController.updateById(req, res)
    const data = res._getJSONData();
    // console.log(data, '支出の編集データ');

    expect(res.statusCode).toBe(200)
    expect(data).toBe('支出の編集に成功しました')
    expect(mockExpense.update).toHaveBeenCalled()
    expect(mockExpense.update).toHaveBeenCalledWith(req.body)
    expect(mockExpense.update).toHaveBeenCalledTimes(1)
  })
})

describe('ExpenseController.deleteById', () => {
  it('支出の削除と成功した旨のメッセージ', async () => {
    const mockExpense = {
      ...expenses[0],
      destroy: jest.fn().mockResolvedValue(true),
    }
    const req = createRequest({
      method: 'DELETE',
      url: '/api/budgets/:budgetId/expenses/:expenseId',
      expense: mockExpense,
    })
    const res = createResponse()
    await ExpenseController.deleteById(req, res)
    const data = res._getJSONData();
    // console.log(data);

    expect(res.statusCode).toBe(200)
    expect(data).toBe('支出の削除に成功しました')
    expect(mockExpense.destroy).toHaveBeenCalled()
    expect(mockExpense.destroy).toHaveBeenCalledTimes(1)

  })
})

