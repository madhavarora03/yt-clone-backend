import { getChannelStats, getChannelVideos } from '@/controllers';
import { verifyJwt } from '@/middleware';
import { Router } from 'express';

const router = Router();
router.use(verifyJwt);

router.route('/stats').get(getChannelStats);
router.route('/videos').get(getChannelVideos);

export default router;
