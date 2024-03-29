import { AuthenticatedRequest } from '@/interfaces';
import { Subscription, User } from '@/models';
import HttpError from '@/utils/HttpError';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';

export const toggleSubscription = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { channelId } = req.params;
    const { user } = req;

    const channel = await User.findOne({ _id: channelId });

    if (!channel) {
      throw new HttpError(404, 'Channel not found!');
    }

    const subscription = await Subscription.findOne({
      subscriber: user?._id,
      channel: channelId,
    });

    if (subscription) {
      await Subscription.deleteOne({ _id: subscription._id });
    } else {
      await Subscription.create({ subscriber: user?._id, channel: channelId });
    }
    return res
      .status(200)
      .json(
        new HttpResponse(
          200,
          {},
          `${!subscription ? 'Subscription added successfully!' : 'Subscription removed successfully!'}`,
        ),
      );
  },
);

export const getUserChannelSubscribers = catchAsync(async (req, res) => {
  const { channelId } = req.params;
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    'subscriber',
  );

  return res
    .status(200)
    .json(
      new HttpResponse(
        200,
        { subscribers },
        'Subscribers fetched successfully!',
      ),
    );
});

export const getSubscribedChannels = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const subscriptions = await Subscription.find({
    subscriber: userId,
  }).populate('channel');

  return res
    .status(200)
    .json(
      new HttpResponse(
        200,
        { subscriptions },
        'Subscriptions fetched successfully!',
      ),
    );
});
