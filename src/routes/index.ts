import { Router } from 'express';
import adminRoute from './admin.route';
import commentRoute from './comment.route';
import dashboardRoute from './dashboard.route';
import healthCheckRoute from './healthcheck.route';
import likeRoute from './like.route';
import playlistRoute from './playlist.route';
import subscriptionRoute from './subscription.route';
import tweetRoute from './tweet.route';
import userRoute from './user.route';
import videoRoute from './video.route';

const router = Router();

router.use('/user', userRoute);
router.use('/health-check', healthCheckRoute);
router.use('/tweet', tweetRoute);
router.use('/like', likeRoute);
router.use('/subscription', subscriptionRoute);
router.use('/comment', commentRoute);
router.use('/video', videoRoute);
router.use('/playlist', playlistRoute);
router.use('/dashboard', dashboardRoute);
router.use('/admin', adminRoute);

export default router;
