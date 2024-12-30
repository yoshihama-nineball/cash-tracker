import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { PostFormatter } from './../../node_modules/schema-utils/declarations/ValidationError.d';
import { Router } from "express"


const router = Router()

router.post('/create-account',
  handleInputErrors,
  AuthController.createAccount,
)

router.post('/confirm-account',
  handleInputErrors,
  AuthController.confirmAccount,
)

router.post('/login',
  handleInputErrors,
  AuthController.login,
)

router.post('/forgot-password',
  handleInputErrors,
  AuthController.forgotPassword,
)

router.post('/validate-token',
  handleInputErrors,
  AuthController.validateToken
)

router.post('/reset-password/:token',
  handleInputErrors,
  AuthController.resetPasswordWithToken,
)

router.get('/user',
  handleInputErrors,
  AuthController.user,
)

router.put('/user',
  handleInputErrors,
  AuthController.user,
)

router.post('/update-password',
  handleInputErrors,
  AuthController.updateCurrentUserPassword
)

router.post('/check-password',
  handleInputErrors,
  AuthController.checkPassword
)

export default router
