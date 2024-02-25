import { AggregatePaginateModel, Document, Model, Schema } from 'mongoose';

export interface Video {
  videoFile: string;
  thumbnail: string;
  owner: Schema.Types.ObjectId;
  title: string;
  description: string;
  views: number;
  duration: number;
  isPublished: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface VideoDocument extends Video, Document {}

export interface VideoMethods extends AggregatePaginateModel<VideoDocument> {}

export interface VideoModel extends Model<Video, VideoDocument, VideoMethods> {}
