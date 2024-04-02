import { AuthenticatedRequest } from '@interfaces';
import { Comment, Like, Tweet, Video } from '@models';
import HttpError from '@utils/HttpError';
import HttpResponse from '@utils/HttpResponse';
import catchAsync from '@utils/catchAsync';
import { Response } from 'express';

async function toggleLike(
  req: AuthenticatedRequest,
  res: Response,
  contentType: string,
  contentId: string,
) {
  const liked = await Like.findOne({
    [contentType]: contentId,
    owner: req.user?._id,
  });

  if (!liked) {
    await Like.create({ [contentType]: contentId, owner: req.user?._id });
    return res
      .status(200)
      .json(new HttpResponse(200, {}, `${contentType} was liked successfully`));
  }

  await Like.deleteOne({ [contentType]: contentId, owner: req.user?._id });
  return res
    .status(200)
    .json(new HttpResponse(200, {}, `${contentType} was unliked successfully`));
}

export const toggleVideoLike = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { videoId } = req.params as { videoId: string };
    const video = await Video.findOne({ _id: videoId });

    if (!video) {
      throw new HttpError(404, 'Video not found!');
    }

    await toggleLike(req, res, 'video', videoId);
  },
);

export const toggleCommentLike = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { commentId } = req.params as { commentId: string };
    const comment = await Comment.findOne({ _id: commentId });

    if (!comment) {
      throw new HttpError(404, 'Comment not found!');
    }

    await toggleLike(req, res, 'comment', commentId);
  },
);

export const toggleTweetLike = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { tweetId } = req.params as { tweetId: string };
    const tweet = await Tweet.findOne({ _id: tweetId });

    if (!tweet) {
      throw new HttpError(404, 'Tweet not found!');
    }

    await toggleLike(req, res, 'tweet', tweetId);
  },
);

export const getLikedVideos = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const likedVideos = await Like.find({
      owner: req.user?._id,
      video: { $exists: true },
    });
    return res
      .status(200)
      .json(
        new HttpResponse(
          200,
          likedVideos,
          'Liked videos retrieved successfully',
        ),
      );
  },
);
