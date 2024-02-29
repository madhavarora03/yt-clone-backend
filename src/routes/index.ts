import { Router } from 'express';
import commentRoute from './comment.route';
import healthCheckRoute from './healthcheck.route';
import likeRoute from './like.route';
import subscriptionRoute from './subscription.route';
import tweetRoute from './tweet.route';
import userRoute from './user.route';

const router = Router();

router.use('/user', userRoute);
router.use('/health-check', healthCheckRoute);
router.use('/tweet', tweetRoute);
router.use('/like', likeRoute);
router.use('/subscription', subscriptionRoute);
router.use('/comment', commentRoute);

export default router;
