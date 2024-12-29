import { Router } from 'express';
import { BudgetController } from '../controllers/BudgetController';
import { ExpenseController } from '../controllers/ExpenseController';
import { handleInputErrors } from '../middleware/validation';
import {
  validateBudgetExists,
  validateBudgetId,
  validateBudgetInput,
} from '../middleware/budget';
import {
  belongsToBudget,
  validateExpenseInput,
  validateExpenseId,
  validateExpenseExists,
} from '../middleware/expense';

const router = Router();

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);

// MEMO: expenseIdのバリデーションとチェックを追加
router.param('expenseId', validateExpenseId);
router.param('expenseId', validateExpenseExists);
router.param('expenseId', belongsToBudget);

router.get('/', BudgetController.getAll);

router.post(
  '/',
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create,
);

router.get('/:budgetId', handleInputErrors, BudgetController.getById);

router.put(
  '/:budgetId',
  handleInputErrors, // パラメータバリデーションの後に配置
  validateBudgetInput,
  handleInputErrors, // ボディバリデーションの後に配置
  BudgetController.updateById,
);

router.delete('/:budgetId', handleInputErrors, BudgetController.deleteById);

router.get('/:budgetId/expenses', handleInputErrors, ExpenseController.getAll);

router.post(
  '/:budgetId/expenses',
  validateExpenseInput, // 追加
  handleInputErrors, // 追加
  ExpenseController.create,
);

router.get(
  '/:budgetId/expenses/:expenseId',
  handleInputErrors,
  ExpenseController.getById,
);

router.put(
  '/:budgetId/expenses/:expenseId',
  handleInputErrors, // パラメータバリデーションの後に配置,
  validateExpenseInput,
  handleInputErrors,
  ExpenseController.updateById,
);

router.delete(
  '/:budgetId/expenses/:expenseId',
  handleInputErrors,
  ExpenseController.deleteById,
);

export default router;
