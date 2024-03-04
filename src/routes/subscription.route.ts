import { getUserChannelSubscribers, toggleSubscription } from '@/controllers';
import { verifyJwt } from '@/middleware';
import { Router } from 'express';

const router = Router();

router.use(verifyJwt);

router
  .route('/c/:channelId')
  .get(getUserChannelSubscribers)
  .post(toggleSubscription);

// router.route('/u/:userId').get(getSubscribedChannels); //admin route

export default router;
