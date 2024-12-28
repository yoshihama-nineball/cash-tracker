import { Router } from 'express';
import { BudgetController } from '../controllers/BudgetController';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
const router = Router();

router.get('/', BudgetController.getAll);

router.post('/',
  body('name')
    .notEmpty().withMessage('予算タイトルは必須です'),
  body('amount')
    .notEmpty().withMessage('予算金額は必須です')
    .isNumeric().withMessage('予算金額の値が無効です')
    .custom(value => value > 0).withMessage('予算金額が0円未満です'),
  handleInputErrors,
  BudgetController.create
);

router.get('/:id',
  param('id').isInt().withMessage('IDが正しくありません')
    .custom(value => value > 0).withMessage('IDの値がマイナスです'),
  handleInputErrors,
  BudgetController.getById
);
router.put('/:id',
  param('id').isInt().withMessage('IDが正しくありません')
    .custom(value => value > 0).withMessage('IDの値がマイナスです'),
  handleInputErrors, // パラメータバリデーションの後に配置

  body('name').notEmpty().withMessage('予算タイトルは必須です'),
  body('amount').notEmpty().withMessage('予算金額は必須です')
    .isNumeric().withMessage('予算金額の値が無効です')
    .custom(value => value > 0).withMessage('予算金額が0円未満です'),
  handleInputErrors, // ボディバリデーションの後に配置

  BudgetController.updateById
);

router.delete('/:id',
  param('id').isInt().withMessage('IDが正しくありません')
    .custom(value => value > 0).withMessage('IDの値がマイナスです'),
  handleInputErrors,
  BudgetController.deleteById
);

export default router;
