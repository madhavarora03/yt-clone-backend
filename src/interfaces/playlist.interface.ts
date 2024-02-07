import { Document, Model, Schema } from 'mongoose';

export interface Playlist {
  title: string;
  description: string;
  videos: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlaylistDocument extends Playlist, Document {}

export interface PlaylistMethods {}

export interface PlaylistModel
  extends Model<PlaylistDocument, PlaylistMethods> {}
