import { AuthenticatedRequest } from '@/interfaces';
import { Like } from '@/models';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
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
    await toggleLike(req, res, 'video', videoId);
  },
);

export const toggleCommentLike = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { commentId } = req.params as { commentId: string };
    await toggleLike(req, res, 'comment', commentId);
  },
);

export const toggleTweetLike = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { tweetId } = req.params as { tweetId: string };
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
