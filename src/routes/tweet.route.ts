import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from '@/controllers';
import { verifyJwt } from '@/middlewares';
import { Router } from 'express';

const router = Router();

// middleware to verify jwt
router.use(verifyJwt);

router.route('/').post(createTweet);
router.route('/user/:username').get(getUserTweets);
router.route('/:tweetId').patch(updateTweet).delete(deleteTweet);

export default router;
