import {
  changeCurrentPassword,
  getCurrentUser,
  getUploadAvatarUrl,
  getUploadCoverImageUrl,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  validateEmail,
  validateUsername,
} from '@controllers';
import { verifyJwt } from '@middleware';
import { Router } from 'express';

const router = Router();

// public routes
router.route('/validate-username').post(validateUsername);
router.route('/validate-email').post(validateEmail);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/c/:username').get(getUserChannelProfile);

// protected routes
router.use(verifyJwt);
router.route('/me').get(getCurrentUser);

router.route('/get-avatar-url').get(getUploadAvatarUrl);
router.route('/get-cover-image-url').get(getUploadCoverImageUrl);

router.route('/logout').post(logoutUser);
router.route('/change-password').post(changeCurrentPassword);

router.route('/update-details').patch(updateAccountDetails);

router.route('/history').get(getWatchHistory);

export default router;
