import { Router } from 'express';
import {
  registerUser,
  validateUsername,
  validateEmail,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from '@/controllers';
import { verifyJwt } from '@/middlewares';

const router = Router();

router.route('/validate-username').post(validateUsername);
router.route('/validate-email').post(validateEmail);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

// protected routes
router.route('/logout').post(verifyJwt, logoutUser);

export default router;
