import { AuthenticatedRequest } from '@/interfaces';
import { Comment, Like, Playlist, User, Video } from '@/models';
import HttpError from '@/utils/HttpError';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
import { deleteObject, putObjectUrl } from '@/utils/s3';
import mongoose from 'mongoose';
export const getVideos = catchAsync(async (req, res) => {
  const {
    page = '1',
    limit = '10',
    query,
    sortBy,
    sortType,
    userId,
  } = req.query as {
    page: string;
    limit: string;
    query: string;
    sortBy: string;
    sortType: string;
    userId: string;
  };

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sortBy]: sortType },
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query || '', $options: 'i' } },
            { description: { $regex: query || '', $options: 'i' } },
          ],
          ...(userId && { owner: new mongoose.Types.ObjectId(userId) }),
          isPublished: true,
        },
      },
    ]),
    options,
  );

  return res
    .status(200)
    .json(new HttpResponse(200, { videos }, 'Videos fetched successfully!'));
});

export const publishVideo = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const {
      title,
      description,
      duration,
      videoFile,
      videoThumbnail,
      isPublished,
    } = req.body;

    const existingVideo = await Video.findOne({
      title,
    });

    if (existingVideo) {
      throw new HttpError(400, 'Video with this title already exists!');
    }

    const video = await Video.create({
      title,
      description,
      duration,
      videoFile: `uploads/${req.user?.username}/videos/${title}-video.${videoFile.split('.').pop()}`,
      thumbnail: `uploads/${req.user?.username}/videos/${title}-thumbnail.${videoThumbnail.split('.').pop()}`,
      owner: req.user?._id,
      isPublished: isPublished || false,
    });

    const uploadVideoUrl = await putObjectUrl(
      req.user?.username as string,
      'videos',
      `${title}/video.${videoFile.split('.').pop()}`,
    );

    const uploadThumbnailUrl = await putObjectUrl(
      req.user?.username as string,
      'videos',
      `${title}/thumbnail.${videoThumbnail.split('.').pop()}`,
    );

    return res
      .status(201)
      .json(
        new HttpResponse(
          201,
          { video, uploadVideoUrl, uploadThumbnailUrl },
          'Video published successfully!',
        ),
      );
  },
);

export const getVideoById = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { videoId } = req.params;

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: { views: 1 },
      },
      { new: true },
    );

    if (!video) {
      throw new HttpError(404, 'Video not found!');
    }

    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $push: {
          watchHistory: {
            video: videoId,
            watchedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    return res
      .status(200)
      .json(new HttpResponse(200, { video }, 'Video fetched successfully!'));
  },
);

export const updateVideo = catchAsync(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, isPublished } = req.body;

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      isPublished,
    },
    { new: true },
  );

  if (!video) {
    throw new HttpError(404, 'Video not found!');
  }

  return res
    .status(200)
    .json(new HttpResponse(200, { video }, 'Video updated successfully!'));
});

export const deleteVideo = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { videoId } = req.params;

    const video = await Video.findById({ _id: videoId });

    if (!video) {
      throw new HttpError(404, 'Video not found!');
    }

    await deleteObject(video.videoFile as string);

    await deleteObject(video.thumbnail as string);

    await Video.findByIdAndDelete(videoId);

    return res
      .status(204)
      .json(new HttpResponse(204, {}, 'Video deleted successfully!'));
  },
);

export const togglePublishStatus = catchAsync(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new HttpError(404, 'Video not found!');
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      isPublished: !video.isPublished,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new HttpResponse(
        200,
        { video: updatedVideo },
        'Video publish status changed successfully!',
      ),
    );
});

export const deleteVideoById = catchAsync(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new HttpError(404, 'Video not found!');
  }

  await deleteObject(video.videoFile as string);
  await deleteObject(video.thumbnail as string);

  await Like.deleteMany({ video: videoId });

  await User.updateMany(
    {},
    {
      $pull: {
        watchHistory: { video: videoId },
      },
    },
  );

  await Playlist.updateMany(
    {},
    {
      $pull: {
        videos: videoId,
      },
    },
  );

  await Comment.deleteMany({ video: videoId });

  await Video.findByIdAndDelete(videoId);

  return res
    .status(204)
    .json(new HttpResponse(204, {}, 'Video deleted successfully!'));
});
