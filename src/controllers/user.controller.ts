import { REFRESH_TOKEN_SECRET } from '@/config';
import { AuthenticationRequest } from '@/interfaces';
import { cookieOptions } from '@/constants';
import { User } from '@/models';
import HttpError from '@/utils/HttpError';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

export const validateUsername = catchAsync(
  async (req: Request, res: Response) => {
    const { username } = req.body;
    if (username.trim() === '' || username === undefined) {
      throw new HttpError(400, 'Username is required');
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new HttpError(409, 'Username already exists');
    }
    res
      .status(200)
      .json(new HttpResponse(200, { username }, 'Username is available'));
  },
);

export const validateEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (email.trim() === '' || email === undefined) {
    throw new HttpError(400, 'Email is required');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, 'Email already exists');
  }
  res.status(200).json(new HttpResponse(200, { email }, 'Email is available'));
});

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

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { username, email, fullName, bio, password } = req.body;
  if (
    [username, email, fullName, bio, password].some(
      (field: string) => field.trim() === '' || field === undefined,
    )
  ) {
    throw new HttpError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new HttpError(409, 'User already exists');
  }

  const user = await User.create({
    username,
    email,
    fullName,
    bio,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  if (!createdUser) {
    throw new HttpError(500, 'Something went wrong while registering the user');
  }

  res
    .status(201)
    .json(
      new HttpResponse(201, { user: createdUser }, 'User created successfully'),
    );
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new HttpError(400, 'Username or Email is required');
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) {
    throw new HttpError(401, 'Invalid user credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .cookie('accessToken', accessToken, cookieOptions)
    .json(
      new HttpResponse(
        200,
        { user: loggedInUser },
        'User logged in successfully',
      ),
    );
});

export const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new HttpError(401, 'Unauthorized request');
    }

    try {
      const decodedToken: JwtPayload = jwt.verify(
        incomingRefreshToken,
        REFRESH_TOKEN_SECRET,
      ) as JwtPayload;

      const user = await User.findById(decodedToken?._id);

      if (!user) {
        throw new HttpError(401, 'Invalid refresh token');
      }

      if (user.refreshToken !== incomingRefreshToken) {
        throw new HttpError(401, 'Refresh token is expired or used');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);
      return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', newRefreshToken, cookieOptions)
        .json(
          new HttpResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            'Access token refreshed!',
          ),
        );
    } catch (error) {
      throw new HttpError(401, 'Invalid refresh token');
    }
  },
);

export const logoutUser = catchAsync(
  async (req: AuthenticationRequest, res: Response) => {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { refreshToken: undefined },
      },
      { new: true },
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };
    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new HttpResponse(200, {}, 'User logged out successfully!'));
  },
);
