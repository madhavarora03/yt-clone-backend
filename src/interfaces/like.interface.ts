import { Document, Model, Schema } from 'mongoose';

export interface Like {
  video?: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
  tweet?: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface LikeDocument extends Like, Document {}

export interface LikeMethods {}

export interface LikeModel extends Model<Like, LikeDocument, LikeMethods> {}
