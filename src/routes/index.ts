import { Router } from 'express';
import userRoute from './user.route';

const router = Router();

router.use('/user', userRoute);

export default router;
