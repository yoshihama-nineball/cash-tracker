import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { authenticate } from '../middleware/auth'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

// router.use(limiter) // ルーターにlimiterを適用

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

router.post(
  '/validate-token',
  body('token')
    .notEmpty()
    .withMessage('認証コードは必須です')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('トークンが無効です'),
  handleInputErrors,
  AuthController.validateToken,
)

router.post(
  '/reset-password/:token',
  // MEMO: paramを使用
  param('token')
    .notEmpty()
    .withMessage('認証コードは必須です')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('トークンが無効です'),
  body('password')
    .notEmpty()
    .withMessage('パスワードは必須です')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上です'),
  handleInputErrors,
  AuthController.resetPasswordWithToken,
)

router.get(
  '/user',
  authenticate,
  // handleInputErrors,
  AuthController.user,
)

router.put(
  '/update-profile',
  body('name').notEmpty().withMessage('ユーザ名は必須です'),
  body('email')
    .isEmail()
    .withMessage('メールアドレスは有効な形式ではありません'),
  authenticate,
  handleInputErrors,
  AuthController.updateUser,
)

router.put(
  '/update-password',
  authenticate,
  body('current_password')
    .notEmpty()
    .withMessage('現在のパスワードは必須です')
    .isLength({ min: 8 })
    .withMessage('現在のパスワードは8文字以上です'),
  body('password')
    .notEmpty()
    .withMessage('再設定するパスワードは必須です')
    .isLength({ min: 8 })
    .withMessage('再設定するパスワードは8文字以上です'),
  handleInputErrors,
  AuthController.updateCurrentUserPassword,
)

router.post(
  '/check-password',
  authenticate,
  body('password').notEmpty().withMessage('パスワードは必須です'),
  handleInputErrors,
  AuthController.checkPassword,
)

export default router
