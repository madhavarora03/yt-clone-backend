import { AggregatePaginateModel, Document, Model, Schema } from 'mongoose';

export interface Comment {
  content: string;
  video: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentDocument extends Comment, Document {}

export interface CommentMethods {}

export interface CommentModel
  extends Model<CommentDocument, AggregatePaginateModel<CommentDocument>> {}
