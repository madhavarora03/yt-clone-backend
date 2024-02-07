import { Router } from 'express';
import healthCheckRoute from './healthcheck.route';
import tweetRoute from './tweet.route';
import userRoute from './user.route';

const router = Router();

router.use('/user', userRoute);
router.use('/health-check', healthCheckRoute);
router.use('/tweets', tweetRoute);

export default router;
