import { REFRESH_TOKEN_SECRET } from '@/config';
import { cookieOptions } from '@/constants';
import { AuthenticatedRequest } from '@/interfaces';
import { User } from '@/models';
import HttpError from '@/utils/HttpError';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
import { generateAccessAndRefreshTokens } from '@/utils/generateTokens';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
    return res
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
  return res
    .status(200)
    .json(new HttpResponse(200, { email }, 'Email is available'));
});

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

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    createdUser._id,
  );

  return res
    .status(201)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new HttpResponse(
        201,
        { user: createdUser, accessToken, refreshToken },
        'User created and logged in successfully',
      ),
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

  return res
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
  async (req: AuthenticatedRequest, res: Response) => {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { refreshToken: undefined },
      },
      { new: true },
    );

    return res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json(new HttpResponse(200, {}, 'User logged out successfully!'));
  },
);

export const getCurrentUser = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    return res
      .status(200)
      .json(
        new HttpResponse(200, { user: req.user }, 'User fetched successfully!'),
      );
  },
);

export const updateAccountDetails = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { email, fullName, bio } = req.body;

    if (!email || !fullName || !bio) {
      throw new HttpError(400, 'All fields are required');
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        email,
        fullName,
        bio,
      },
      { new: true },
    ).select('-password -refreshToken');
    return res
      .status(200)
      .json(
        new HttpResponse(
          200,
          { user },
          'Account details updated successfully!',
        ),
      );
  },
);
