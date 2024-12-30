import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { Router } from 'express'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter) // ルーターにlimiterを適用

router.post(
  '/create-account',
  body('name').notEmpty().withMessage('ユーザー名は必須です'),
  body('password')
    .notEmpty()
    .withMessage('パスワードは必須です')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上です'),
  body('email')
    .isEmail()
    .withMessage('メールアドレスは有効な形式ではありません'),
  handleInputErrors,
  AuthController.createAccount,
)

router.post(
  '/confirm-account',
  body('token')
    .notEmpty()
    .withMessage('認証コードは必須です')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('トークンが無効です'),
  handleInputErrors,
  AuthController.confirmAccount,
)

router.post(
  '/login',
  body('email')
    .isEmail()
    .withMessage('メールアドレスは有効な形式ではありません'),
  body('password')
    .notEmpty()
    .withMessage('パスワードは必須です')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上にしてください'),
  handleInputErrors,
  AuthController.login,
)

router.post(
  '/forgot-password',
  body('email')
    .isEmail()
    .withMessage('メールアドレスは有効な形式ではありません'),
  handleInputErrors,
  AuthController.forgotPassword,
)

router.post('/validate-token', handleInputErrors, AuthController.validateToken)

router.post(
  '/reset-password/:token',
  handleInputErrors,
  AuthController.resetPasswordWithToken,
)

router.get('/user', handleInputErrors, AuthController.user)

router.put('/user', handleInputErrors, AuthController.user)

router.post(
  '/update-password',
  handleInputErrors,
  AuthController.updateCurrentUserPassword,
)

router.post('/check-password', handleInputErrors, AuthController.checkPassword)

export default router
