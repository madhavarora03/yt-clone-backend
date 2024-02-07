import { Router } from 'express';
import healthCheckRoute from './healthcheck.route';
import userRoute from './user.route';

const router = Router();

router.use('/user', userRoute);
router.use('/health-check', healthCheckRoute);

export default router;
