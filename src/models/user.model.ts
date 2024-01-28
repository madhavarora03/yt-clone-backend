import { Schema, model } from 'mongoose';
import { UserDocument, UserModel, UserMethods } from '@/interfaces';

const watchHistorySchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const userSchema = new Schema<UserDocument, UserModel, UserMethods>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, // S3 URL
      required: true,
    },
    coverImage: {
      type: String, // S3 URL
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    watchHistory: [watchHistorySchema],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
