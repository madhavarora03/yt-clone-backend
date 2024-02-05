import {
  changeCurrentPassword,
  getCurrentUser,
  getUploadAvatarUrl,
  getUploadCoverImageUrl,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  validateEmail,
  validateUsername,
} from '@/controllers';
import { verifyJwt } from '@/middlewares';
import { Router } from 'express';

const router = Router();

router.route('/validate-username').post(validateUsername);
router.route('/validate-email').post(validateEmail);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

// protected routes
router.route('/me').get(verifyJwt, getCurrentUser);
router.route('/upload-avatar').get(verifyJwt, getUploadAvatarUrl);
router.route('/upload-cover-image').get(verifyJwt, getUploadCoverImageUrl);

router.route('/logout').post(verifyJwt, logoutUser);
router.route('/change-password').post(verifyJwt, changeCurrentPassword);

router.route('/update-details').patch(verifyJwt, updateAccountDetails);

export default router;
