import { AuthenticatedRequest } from '@/interfaces';
import { Playlist, User } from '@/models';
import HttpError from '@/utils/HttpError';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
import mongoose from 'mongoose';

export const createPlaylist = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { title, description } = req.body;

    const playlist = await Playlist.create({
      title,
      description,
      owner: req.user?.id,
    });

    return res
      .status(201)
      .json(
        new HttpResponse(201, { playlist }, 'Playlist created successfully!'),
      );
  },
);

export const getUserPlaylists = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    throw new HttpError(404, 'User not found!');
  }

  const playlists = await Playlist.find({ owner: userId });

  return res
    .status(200)
    .json(new HttpResponse(200, { playlists }, 'Playlists retrieved!'));
});

export const getPlaylistById = catchAsync(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(playlistId) } },
    {
      $unwind: '$videos',
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'videos',
        foreignField: '_id',
        as: 'videos',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ['$owner', 0] },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        videos: {
          $first: '$videos',
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        title: { $first: '$title' },
        description: { $first: '$description' },

        videos: {
          $push: '$videos',
        },
      },
    },
    {
      $addFields: {
        videosCount: { $size: '$videos' },
      },
    },
  ]);

  return res
    .status(200)
    .json(new HttpResponse(200, { playlist }, 'Playlist retrieved!'));
});

export const addVideoToPlaylist = catchAsync(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const isVideoInPlaylist = await Playlist.findOne({
    _id: playlistId,
    videos: videoId,
  });

  if (isVideoInPlaylist) {
    throw new HttpError(400, 'Video already in playlist!');
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $push: { videos: videoId } },
    { new: true },
  );

  return res
    .status(200)
    .json(new HttpResponse(200, { playlist }, 'Video added to playlist!'));
});

export const removeVideoFromPlaylist = catchAsync(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true },
  );

  return res
    .status(200)
    .json(new HttpResponse(200, { playlist }, 'Video removed from playlist!'));
});

export const updatePlaylist = catchAsync(async (req, res) => {
  const { playlistId } = req.params;
  const { title, description } = req.body;

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { title, description },
    { new: true },
  );

  return res
    .status(200)
    .json(new HttpResponse(200, { playlist }, 'Playlist updated!'));
});

export const deletePlaylist = catchAsync(async (req, res) => {
  const { playlistId } = req.params;

  await Playlist.findByIdAndDelete(playlistId);

  return res.status(204).json(new HttpResponse(204, {}, 'Playlist deleted!'));
});
