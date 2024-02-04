import { Router } from 'express';
import {
  registerUser,
  validateUsername,
  validateEmail,
  loginUser,
  refreshAccessToken
} from '@/controllers';

const router = Router();

router.route('/validate-username').post(validateUsername);
router.route('/validate-email').post(validateEmail);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

// protected routes

export default router;
