import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from '@/controllers';
import { verifyJwt } from '@/middlewares';
import { Router } from 'express';

const router = Router();

router.route('/user/:username').get(getUserTweets);

router.use(verifyJwt);

router.route('/').post(createTweet);
router.route('/:tweetId').patch(updateTweet).delete(deleteTweet);

export default router;
