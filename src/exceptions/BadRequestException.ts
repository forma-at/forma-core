import HttpStatusCodes from 'http-status-codes';
import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {

  constructor(message?: string, details?: Object) {
    super(HttpStatusCodes.BAD_REQUEST, message || 'The request was invalid and could not be processed.', details);
  }

}
