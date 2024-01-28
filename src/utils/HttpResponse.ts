class HttpResponse {
  public statusCode: number;
  public message: string;
  public data: object;
  public success: boolean;
  constructor(statusCode: number, data: object, message = 'Success') {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = true;
  }
}

export default HttpResponse;
