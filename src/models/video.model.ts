import { Schema, model } from 'mongoose';
import { VideoDocument, VideoModel, VideoMethods } from '@/interfaces';

const videoSchema = new Schema<VideoDocument, VideoModel, VideoMethods>(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Video = model<VideoDocument, VideoModel>('Video', videoSchema);

export default Video;
