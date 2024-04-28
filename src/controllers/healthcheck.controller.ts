import catchAsync from '@/utils/catchAsync';
import HttpResponse from '@/utils/HttpResponse';

export const healthCheck = catchAsync(async (_, res) => {
  res
    .status(200)
    .json(
      new HttpResponse(
        200,
        {},
        'Everything is OK! Relax and have a chai latte ☕︎',
      ),
    );
});
