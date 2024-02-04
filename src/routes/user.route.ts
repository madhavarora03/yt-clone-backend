import { Router } from 'express';
import { registerUser, validateUsername } from '@/controllers';

const router = Router();

router.route('/validate-username').post(validateUsername);
router.route('/register').post(registerUser);

export default router;
