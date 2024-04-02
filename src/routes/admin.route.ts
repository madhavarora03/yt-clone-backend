import {
  deleteCommentById,
  deletePlaylistById,
  deleteTweetById,
  deleteUserById,
  deleteVideoById,
} from '@controllers';
import { verifyAdmin, verifyJwt } from '@middleware';
import { Router } from 'express';

const router = Router();

router.use(verifyJwt, verifyAdmin);

router.route('/u/:userId').delete(deleteUserById);
router.route('/v/:videoId').delete(deleteVideoById);
router.route('/p/:playlistId').delete(deletePlaylistById);
router.route('/c/:commentId').delete(deleteCommentById);
router.route('/t/:tweetId').delete(deleteTweetById);

export default router;
