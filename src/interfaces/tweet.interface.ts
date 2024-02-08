import { Document, Model, Schema } from 'mongoose';

export interface Tweet {
  owner: Schema.Types.ObjectId;
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface TweetDocument extends Tweet, Document {}

export interface TweetMethods {}

export interface TweetModel extends Model<TweetDocument> {}
