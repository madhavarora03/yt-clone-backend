import { ACCESS_TOKEN_SECRET } from '@/config';
import { AuthenticatedRequest } from '@/interfaces';
import { User } from '@/models';
import HttpError from '@/utils/HttpError';
import catchAsync from '@/utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyJwt = catchAsync(
  async (req: AuthenticatedRequest, _, next) => {
    try {
      const token =
        req.cookies?.accessToken || req.header('Authorization')?.split(' ')[1];

      if (!token) {
        throw new HttpError(401, 'Unauthorized request');
      }

      // Verify the token
      const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

      const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken',
      );

      if (!user) {
        throw new HttpError(401, 'Invalid access token');
      }

      req.user = user;
      next();
    } catch (error) {
      throw new HttpError(401, 'Invalid access token');
    }
  },
);

export const verifyAdmin = catchAsync(
  async (req: AuthenticatedRequest, _, next) => {
    if (!req.user?.isAdmin) {
      throw new HttpError(403, 'Not authorized to access this route');
    }

    // TODO: Set up MFA for admin users

    next();
  },
);
