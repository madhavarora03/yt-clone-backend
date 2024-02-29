import { AuthenticatedRequest } from '@/interfaces';
import { Comment } from '@/models';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';

export const getVideoComments = catchAsync(async (req, res) => {
  const { videoId } = req.params;
  const { page = '1', limit = '10' } = req.query as {
    page: string;
    limit: string;
  };

  const comments = await Comment.find({ video: videoId })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .populate('user');

  console.log(comments);

  return res
    .status(200)
    .json(
      new HttpResponse(200, { comments }, 'Comments fetched successfully!'),
    );
});

export const addComment = catchAsync(async (req: AuthenticatedRequest, res) => {
  const { videoId } = req.params as { videoId: string };

  const { user } = req;

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
