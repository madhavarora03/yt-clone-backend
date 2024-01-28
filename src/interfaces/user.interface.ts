import { Document, Model } from 'mongoose';

interface WatchHistory {
  videoId: string;
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

export interface UserMethods {}

export interface UserModel extends Model<User, UserDocument, UserMethods> {}
