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

router.route('/').get(getVideos);
router.route('/:videoId').get(getVideoById);

router.use(verifyJwt);

router.route('/').post(publishVideo);
router
  .route('/:videoId')
  .patch(updateVideo)
  .delete(deleteVideo)
  .post(togglePublishStatus);

export default router;
