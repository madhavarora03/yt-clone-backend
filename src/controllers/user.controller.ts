import { AWS_REGION, REFRESH_TOKEN_SECRET } from '@/config';
import { AWS_S3_BUCKET_NAME, cookieOptions } from '@/constants';
import { AuthenticatedRequest } from '@/interfaces';
import { User } from '@/models';
import HttpError from '@/utils/HttpError';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
import { generateAccessAndRefreshTokens } from '@/utils/generateTokens';
import { putObjectUrl } from '@/utils/s3';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Validate Username.
 * @route POST /validate-username
 */

export const validateUsername = catchAsync(async (req, res) => {
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
});

/**
 * Validate Email.
 * @route POST /validate-email
 */

export const validateEmail = catchAsync(async (req, res) => {
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

/**
 * Register new user.
 * @route POST /register
 */

export const registerUser = catchAsync(async (req, res) => {
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

/**
 * Login user.
 * @route POST /login
 */

export const loginUser = catchAsync(async (req, res) => {
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

/**
 * Refresh access token.
 * @route POST /refresh-token
 */

export const refreshAccessToken = catchAsync(async (req, res) => {
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
});

/**
 * Logout user.
 * @route POST /logout
 * @access Private
 */

export const logoutUser = catchAsync(async (req: AuthenticatedRequest, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true },
  );

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new HttpResponse(200, {}, 'User logged out successfully!'));
});

export const getCurrentUser = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    return res
      .status(200)
      .json(
        new HttpResponse(200, { user: req.user }, 'User fetched successfully!'),
      );
  },
);

/**
 * Update account details.
 * @route PATCH /update-details
 * @access Private
 */

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

export const changeCurrentPassword = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user?.matchPassword(oldPassword);

    if (!isPasswordCorrect) {
      throw new HttpError(400, 'Invalid old password');
    }

    user!.password = newPassword;

    await user?.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new HttpResponse(200, {}, 'Password changed successfully!'));
  },
);

export const getUploadAvatarUrl = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { name } = req.query as { name: string };

    const avatarPutUrl = await putObjectUrl(
      req.user?.username as string,
      'profile',
      `avatar.${name.split('.').pop() as string}`,
    );

    return res.status(200).json(
      new HttpResponse(
        200,
        {
          uploadUrl: avatarPutUrl,
          contentUrl: `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/uploads/${req.user?.username}/profile/avatar.${name.split('.').pop() as string}`,
        },
        'Avatar upload URL generated successfully!',
      ),
    );
  },
);

export const getUploadCoverImageUrl = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { name } = req.query as { name: string };

    const coverPutUrl = await putObjectUrl(
      req.user?.username as string,
      'profile',
      `cover.${name.split('.').pop() as string}`,
    );

    return res.status(200).json(
      new HttpResponse(
        200,
        {
          uploadUrl: coverPutUrl,
          contentUrl: `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/uploads/${req.user?.username}/profile/cover.${name.split('.').pop() as string}`,
        },
        'Cover image upload URL generated successfully!',
      ),
    );
  },
);

export const getUserChannelProfile = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
      throw new HttpError(400, 'Username is required');
    }

    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'channel',
          as: 'subscribers',
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'subscriber',
          as: 'subscribedTo',
        },
      },
      {
        $addFields: {
          subscriberCount: { $size: '$subscribers' },
          channelsSubscribedToCount: { $size: '$subscribedTo' },
          isSubscribed: {
            $cond: {
              if: {
                $in: [req.user?._id, '$subscribers.subscriber'],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscriberCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          cover: 1,
          bio: 1,
          email: 1,
          createdAt: 1,
        },
      },
    ]);

    if (channel.length === 0) {
      throw new HttpError(404, 'Channel does not exist');
    }

    return res
      .status(200)
      .json(
        new HttpResponse(
          200,
          { channel: channel[0] },
          'Channel profile fetched successfully!',
        ),
      );
  },
);

export const getWatchHistory = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $unwind: '$watchHistory',
      },
      {
        $lookup: {
          from: 'videos',
          localField: 'watchHistory.video',
          foreignField: '_id',
          as: 'watchHistory.video',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: '$owner',
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          'watchHistory.video': {
            $first: '$watchHistory.video',
          },
        },
      },
      {
        $sort: {
          'watchHistory.watchedAt': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          watchHistory: {
            $push: '$watchHistory',
          },
        },
      },
      {
        $project: {
          _id: 0,
          watchHistory: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new HttpResponse(
          200,
          { watchHistory: user[0].watchHistory },
          'Watch history fetched successfully!',
        ),
      );
  },
);
