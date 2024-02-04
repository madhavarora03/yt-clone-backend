import { Router } from 'express';
import {
  registerUser,
  validateUsername,
  validateEmail,
  loginUser,
} from '@/controllers';

const router = Router();

router.route('/validate-username').post(validateUsername);
router.route('/validate-email').post(validateEmail);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// protected routes

export default router;
