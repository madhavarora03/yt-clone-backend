import { Document, Model, Schema } from 'mongoose';

export interface WatchHistory {
  video: Schema.Types.ObjectId;
  watchedAt: Date;
}

export interface User {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  bio: string;
  password: string;
  watchHistory: WatchHistory[];

  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends User, Document {}

export interface UserMethods {
  matchPassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

export interface UserModel extends Model<User, UserDocument, UserMethods> {}
