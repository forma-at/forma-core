import HttpStatusCodes from 'http-status-codes';
import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {

  constructor(message?: string, details?: Object) {
    super(HttpStatusCodes.NOT_FOUND, message || 'The requested resource not found.', details);
  }

}
