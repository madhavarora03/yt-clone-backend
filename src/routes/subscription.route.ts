import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from '@/controllers';
import { verifyAdmin, verifyJwt } from '@/middleware';
import { Router } from 'express';

const router = Router();

router.use(verifyJwt);

router.route('/c/:channelId').post(toggleSubscription);

// Admin routes
router.use(verifyAdmin);

router.route('/u/:userId').get(getSubscribedChannels);
router.route('/c/:channelId').get(getUserChannelSubscribers);

export default router;
