import { AuthenticatedRequest } from '@interfaces';
import { Like, Subscription, Video } from '@models';
import HttpResponse from '@utils/HttpResponse';
import catchAsync from '@utils/catchAsync';
import mongoose from 'mongoose';

export const getChannelStats = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const totalVideos = await Video.countDocuments({ owner: req.user?._id });

    const totalVideoViews = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $group: {
          _id: null,
          totalVideoViews: {
            $sum: '$views',
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalVideoViews: 1,
        },
      },
    ]);

    const totalSubscribers = await Subscription.countDocuments({
      channel: req.user?._id,
    });

    const totalLikes = await Like.aggregate([
      {
        $match: {
          video: {
            $in: await Video.find({ owner: req.user?._id }),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalLikes: 1,
        },
      },
    ]);

    return res.status(200).json(
      new HttpResponse(
        200,
        {
          totalVideoViews: totalVideoViews[0].totalVideoViews,
          totalVideos,
          totalLikes: totalLikes[0].totalLikes,
          totalSubscribers,
        },
        'Channel Stats fetched successfully',
      ),
    );
  },
);

export const getChannelVideos = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const videos = await Video.find({ owner: req.user?._id });

    return res
      .status(200)
      .json(new HttpResponse(200, { videos }, 'Videos fetched successfully'));
  },
);
