import { User } from '@/models';
import HttpError from '@/utils/HttpError';
import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';
import { Request, Response } from 'express';

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
