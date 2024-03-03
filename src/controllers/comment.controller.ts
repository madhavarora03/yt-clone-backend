import { AuthenticatedRequest } from '@/interfaces';
import { Comment, Video } from '@/models';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
import mongoose from 'mongoose';

export const getVideoComments = catchAsync(async (req, res) => {
  const { videoId } = req.params;

  const doesVideoExist = await Video.exists({ _id: videoId });

  if (!doesVideoExist) {
    return res.status(404).json(new HttpResponse(404, {}, 'Video not found!'));
  }

  const { page = '1', limit = '10' } = req.query as {
    page: string;
    limit: string;
  };

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      { $match: { video: new mongoose.Types.ObjectId(videoId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: {
            _id: 1,
            username: 1,
            avatar: 1,
          },
        },
      },
    ]),
    options,
  );

  return res
    .status(200)
    .json(
      new HttpResponse(200, { comments }, 'Comments fetched successfully!'),
    );
});

export const addComment = catchAsync(async (req: AuthenticatedRequest, res) => {
  const { videoId } = req.params as { videoId: string };

  const { user } = req;

  const doesVideoExist = await Video.exists({ _id: videoId });

  if (!doesVideoExist) {
    return res.status(404).json(new HttpResponse(404, {}, 'Video not found!'));
  }

  const comment = await Comment.create({
    content: req?.body?.content,
    video: videoId,
    owner: user?._id,
  });

  return res
    .status(201)
    .json(new HttpResponse(201, { comment }, 'Comment added successfully!'));
});

export const deleteComment = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { commentId } = req.params;
    const { user } = req;

    const comment = await Comment.findOne({ _id: commentId, owner: user?._id });

    if (!comment) {
      return res
        .status(404)
        .json(new HttpResponse(404, {}, 'Comment not found!'));
    }

    await Comment.deleteOne({ _id: commentId });

    return res
      .status(200)
      .json(new HttpResponse(200, {}, 'Comment deleted successfully!'));
  },
);

export const updateComment = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { commentId } = req.params;
    const { user } = req;

    const comment = await Comment.findOne({ _id: commentId, owner: user?._id });

    if (!comment) {
      return res
        .status(404)
        .json(new HttpResponse(404, {}, 'Comment not found!'));
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId },
      { content: req?.body?.content },
      { new: true },
    );

    return res
      .status(200)
      .json(
        new HttpResponse(
          200,
          { updatedComment },
          'Comment updated successfully!',
        ),
      );
  },
);
