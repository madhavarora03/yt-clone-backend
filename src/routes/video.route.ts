import {
  deleteVideo,
  getVideoById,
  getVideos,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from '@/controllers';
import { verifyJwt } from '@/middlewares';
import { Router } from 'express';

const router = Router();

router.use(verifyJwt);

router.route('/').get(getVideos).post(publishVideo);

router
  .route('/:videoId')
  .get(getVideoById)
  .patch(updateVideo)
  .delete(deleteVideo)
  .post(togglePublishStatus);

export default router;
