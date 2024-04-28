import { PlaylistDocument, PlaylistMethods, PlaylistModel } from '@/interfaces';
import { Schema, model } from 'mongoose';

const playlistSchema = new Schema<
  PlaylistDocument,
  PlaylistModel,
  PlaylistMethods
>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Playlist = model<PlaylistDocument, PlaylistModel>(
  'Playlist',
  playlistSchema,
);

export default Playlist;
