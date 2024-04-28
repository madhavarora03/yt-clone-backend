import { healthCheck } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.route('/').get(healthCheck);

export default router;
