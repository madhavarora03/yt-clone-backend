import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from '@controllers';
import { verifyJwt } from '@middleware';
import { Router } from 'express';

const router = Router();

router.route('/:videoId').get(getVideoComments);

router.use(verifyJwt);

router.route('/:videoId').post(addComment);

router.route('/c/:commentId').delete(deleteComment).patch(updateComment);

export default router;
