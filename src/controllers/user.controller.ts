import HttpResponse from '@/utils/HttpResponse';
import catchAsync from '@/utils/catchAsync';

export const registerUser = catchAsync(async (req, res) => {
  res.status(500).json(new HttpResponse(500, {}, 'Not implemented yet'));
});
