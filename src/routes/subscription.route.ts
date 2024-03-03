import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from '@/controllers';
import { verifyJwt } from '@/middlewares';
import { Router } from 'express';

const router = Router();
router.use(verifyJwt);

router
  .route('/c/:channelId')
  .get(getUserChannelSubscribers)
  .post(toggleSubscription);

router.route('/u/:userId').get(getSubscribedChannels);

export default router;