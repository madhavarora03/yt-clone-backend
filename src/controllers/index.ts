import {
  changeCurrentPassword,
  deleteUserById,
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
  deleteTweetById,
  getUserTweets,
  updateTweet,
} from './tweet.controller';

import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from './like.controller';

import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from './subscription.controller';

import {
  addComment,
  deleteComment,
  deleteCommentById,
  getVideoComments,
  updateComment,
} from './comment.controller';

import {
  deleteVideo,
  deleteVideoById,
  getVideoById,
  getVideos,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from './video.controller';

import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  deletePlaylistById,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from './playlist.controller';

import { getChannelStats, getChannelVideos } from './dashboard.controller';

export {
  changeCurrentPassword,
  deleteUserById,
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

export {
  createTweet,
  deleteTweet,
  deleteTweetById,
  getUserTweets,
  updateTweet,
};

export { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike };

export { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription };

export {
  addComment,
  deleteComment,
  deleteCommentById,
  getVideoComments,
  updateComment,
};

export {
  deleteVideo,
  deleteVideoById,
  getVideoById,
  getVideos,
  publishVideo,
  togglePublishStatus,
  updateVideo,
};

export {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  deletePlaylistById,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
};

export { getChannelStats, getChannelVideos };
