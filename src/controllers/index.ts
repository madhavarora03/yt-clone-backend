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
} from './user.controller';

import { healthCheck } from './healthcheck.controller';

export {
  changeCurrentPassword,
  getCurrentUser,
  getUploadAvatarUrl,
  getUploadCoverImageUrl,
  getUserChannelProfile,
  getWatchHistory,
  healthCheck,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  validateEmail,
  validateUsername,
};
