import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from '@/controllers';
import { verifyJwt } from '@/middlewares';
import { Router } from 'express';

const router = Router();

router.use(verifyJwt);

router.route('/:videoId').get(getVideoComments).post(addComment);

router.route('/c/:commentId').delete(deleteComment).patch(updateComment);

export default router;
