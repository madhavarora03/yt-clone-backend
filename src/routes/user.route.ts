import { Router } from 'express';
import { registerUser, validateUsername, validateEmail } from '@/controllers';

const router = Router();

router.route('/validate-username').post(validateUsername);
router.route('/validate-email').post(validateEmail);
router.route('/register').post(registerUser);

export default router;
