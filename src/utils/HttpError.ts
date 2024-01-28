class HttpError extends Error {
  public statusCode: number;
  public errors: object[];
  public success: boolean;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message = 'Something went wrong',
    errors = [],
    isOperational = true,
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = isOperational;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default HttpError;
