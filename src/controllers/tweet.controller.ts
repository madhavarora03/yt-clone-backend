import { AuthenticatedRequest } from '@interfaces';
import { Like, Tweet, User } from '@models';
import HttpError from '@utils/HttpError';
import HttpResponse from '@utils/HttpResponse';
import catchAsync from '@utils/catchAsync';

export const createTweet = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { content } = req.body;
    const tweet = await Tweet.create({ owner: req.user?._id, content });

    return res
      .status(201)
      .json(new HttpResponse(201, tweet, 'Tweet created successfully'));
  },
);

export const getUserTweets = catchAsync(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) {
    throw new HttpError(404, 'User not found!');
  }

  const tweets = await Tweet.find({ owner: user?._id });

  return res
    .status(200)
    .json(new HttpResponse(200, tweets, 'Tweets retrieved successfully'));
});

export const updateTweet = catchAsync(async (req, res) => {
  const { content: newContent } = req.body;

  const tweet = await Tweet.findByIdAndUpdate(
    req.params?.tweetId,
    { $set: { content: newContent } },
    { new: true },
  );

  if (!tweet) {
    throw new HttpError(404, 'Tweet not found!');
  }

  return res
    .status(200)
    .json(new HttpResponse(200, { tweet }, 'Tweet updated successfully'));
});

export const deleteTweet = catchAsync(async (req, res) => {
  await Tweet.findByIdAndDelete(req.params.tweetId);

  return res
    .status(204)
    .json(new HttpResponse(204, {}, 'Tweet deleted successfully'));
});

export const deleteTweetById = catchAsync(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new HttpError(404, 'Tweet not found!');
  }

  await Like.deleteMany({ tweet: tweetId });
  await Tweet.findById(tweetId);

  return res
    .status(204)
    .json(new HttpResponse(204, {}, 'Tweet deleted successfully'));
});
