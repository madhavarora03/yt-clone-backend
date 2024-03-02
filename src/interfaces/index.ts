import { AuthenticatedRequest } from './auth.interface';

import {
  User,
  UserDocument,
  UserMethods,
  UserModel,
  WatchHistory,
} from './user.interface';

import {
  Video,
  VideoDocument,
  VideoMethods,
  VideoModel,
} from './video.interface';

import {
  Subscription,
  SubscriptionDocument,
  SubscriptionMethods,
  SubscriptionModel,
} from './subscription.interface';

import {
  Comment,
  CommentDocument,
  CommentMethods,
  CommentModel,
} from './comment.interface';

import { Like, LikeDocument, LikeMethods, LikeModel } from './like.interface';

import {
  Playlist,
  PlaylistDocument,
  PlaylistMethods,
  PlaylistModel,
} from './playlist.interface';

import {
  Tweet,
  TweetDocument,
  TweetMethods,
  TweetModel,
} from './tweet.interface';

export { AuthenticatedRequest };

export { Comment, CommentDocument, CommentMethods, CommentModel };

export { Like, LikeDocument, LikeMethods, LikeModel };

export { Playlist, PlaylistDocument, PlaylistMethods, PlaylistModel };

export {
  Subscription,
  SubscriptionDocument,
  SubscriptionMethods,
  SubscriptionModel,
};

export { Tweet, TweetDocument, TweetMethods, TweetModel };

export { User, UserDocument, UserMethods, UserModel, WatchHistory };

export { Video, VideoDocument, VideoMethods, VideoModel };
