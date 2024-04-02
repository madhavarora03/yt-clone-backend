import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from '@controllers';
import { verifyJwt } from '@middleware';
import { Router } from 'express';

const router = Router();

router.route('/user/:userId').get(getUserPlaylists);
router.route('/:playlistId').get(getPlaylistById);

router.use(verifyJwt);

router.route('/').post(createPlaylist);

router.route('/:playlistId').patch(updatePlaylist).delete(deletePlaylist);

router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist);
router.route('/remove/:videoId/:playlistId').patch(removeVideoFromPlaylist);

export default router;
