import { Router } from 'express'
import { BudgetController } from '../controllers/BudgetController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import {
  validateBudgetExists,
  validateBudgetId,
  validateBudgetInput,
} from '../middleware/budget'
import { ExpenseController } from '../controllers/ExpenseController'
const router = Router()

// MEMO: router.paramはbudgetIdがURLパラメータとしてある場合に実行するために追加
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists)

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

router.get('/:budgetId/expenses',
  ExpenseController.getAll,
)

router.post('/:budgetId/expenses',
  ExpenseController.create,
)

router.get('/:budgetId/expenses/:expensesId',
  ExpenseController.getById,
)

router.put('/:budgetId/expenses/:expensesId',
  ExpenseController.updateById,
)

router.delete('/:budgetId/expenses/:expensesId',
  ExpenseController.deleteById,
)

export default router
