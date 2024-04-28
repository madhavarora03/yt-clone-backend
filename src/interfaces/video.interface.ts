import {
  Aggregate,
  AggregatePaginateResult,
  Document,
  Model,
  PaginateOptions,
  Schema,
} from 'mongoose';

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

export interface VideoMethods {}

export interface VideoModel extends Model<Video, VideoDocument, VideoMethods> {
  aggregatePaginate<T>(
    query?: Aggregate<T[]>,
    options?: PaginateOptions,
    callback?: (err: never, result: AggregatePaginateResult<T>) => void,
  ): Promise<AggregatePaginateResult<T>>;
}
