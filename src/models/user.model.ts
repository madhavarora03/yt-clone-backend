import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  UserDocument,
  UserModel,
  UserMethods,
  WatchHistory,
} from '@/interfaces';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from '@/config';

const watchHistorySchema = new Schema<WatchHistory>(
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
    },
    coverImage: {
      type: String, // S3 URL
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.fullName,
      email: this.email,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );
};

const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
