import { Router } from 'express'
import { BudgetController } from '../controllers/BudgetController'
import { ExpenseController } from '../controllers/ExpenseController'
import { handleInputErrors } from '../middleware/validation'
import {
  hasAccess,
  validateBudgetExists,
  validateBudgetId,
  validateBudgetInput,
} from '../middleware/budget'
import {
  belongsToBudget,
  validateExpenseInput,
  validateExpenseId,
  validateExpenseExists,
} from '../middleware/expense'
import { authenticate } from '../middleware/auth'

const router = Router()

//MEMO: ユーザ認証を、予算データのCRUDすべてにおいて確認
router.use(authenticate)

router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists)
router.param('budgetId', hasAccess)

// MEMO: expenseIdのバリデーションとチェックを追加
router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExists)
router.param('expenseId', belongsToBudget)

router.get('/', BudgetController.getAll)

router.post(
  '/',
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create,
)

router.get('/:budgetId', handleInputErrors, BudgetController.getById)

router.put(
  '/:budgetId',
  handleInputErrors, // パラメータバリデーションの後に配置
  validateBudgetInput,
  handleInputErrors, // ボディバリデーションの後に配置
  BudgetController.updateById,
)

router.delete('/:budgetId', handleInputErrors, BudgetController.deleteById)

router.get('/:budgetId/expenses', handleInputErrors, ExpenseController.getAll)

router.post(
  '/:budgetId/expenses',
  validateExpenseInput,
  handleInputErrors,
  ExpenseController.create,
)

router.get(
  '/:budgetId/expenses/:expenseId',
  handleInputErrors,
  ExpenseController.getById,
)

router.put(
  '/:budgetId/expenses/:expenseId',
  handleInputErrors,
  validateExpenseInput,
  handleInputErrors,
  ExpenseController.updateById,
)

router.delete(
  '/:budgetId/expenses/:expenseId',
  handleInputErrors,
  ExpenseController.deleteById,
)

export default router
