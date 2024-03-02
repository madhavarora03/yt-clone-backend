import {
  Aggregate,
  AggregatePaginateResult,
  Document,
  Model,
  PaginateOptions,
  Schema,
} from 'mongoose';

export interface Comment {
  content: string;
  video: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentDocument extends Comment, Document {}

export interface CommentMethods {}

// Manually define the CommentModel interface to include the aggregatePaginate method
export interface CommentModel extends Model<CommentDocument> {
  aggregatePaginate<T>(
    query?: Aggregate<T[]>,
    options?: PaginateOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (err: any, result: AggregatePaginateResult<T>) => void,
  ): Promise<AggregatePaginateResult<T>>;
}
