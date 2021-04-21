export class HttpException extends Error {

  status: number;
  message: string;
  details?: Object;

  constructor(status: number, message: string, details?: Object) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
  }

}
