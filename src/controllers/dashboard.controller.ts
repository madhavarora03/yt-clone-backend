import { AuthenticatedRequest } from '@/interfaces';
import catchAsync from '@/utils/catchAsync';

export const getChannelStats = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  
  },
);

export const getVideoStats = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    // TODO: Get the video stats like total views, total likes, total comments etc.
  },
);
