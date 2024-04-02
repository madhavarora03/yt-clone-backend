import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from '@controllers';
import { verifyJwt } from '@middleware';
import { Router } from 'express';

const router = Router();

// middleware to verify jwt
router.use(verifyJwt);

router.route('/toggle/v/:videoId').post(toggleVideoLike);
router.route('/toggle/c/:commentId').post(toggleCommentLike);
router.route('/toggle/t/:tweetId').post(toggleTweetLike);
router.route('/videos').get(getLikedVideos);

export default router;
