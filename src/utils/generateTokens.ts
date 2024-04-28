import { User } from '@/models';
import mongoose from 'mongoose';
import HttpError from './HttpError';

export const generateAccessAndRefreshTokens = async (
  userId: mongoose.Types.ObjectId,
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new HttpError(500, 'Something went wrong while generating tokens');
  }
};
