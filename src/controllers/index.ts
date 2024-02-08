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

import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from './tweet.controller';

import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from './like.controller';

export {
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
};

export { healthCheck };

export { createTweet, deleteTweet, getUserTweets, updateTweet };

export { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike };
