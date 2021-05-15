import HttpStatusCodes from 'http-status-codes';
import { HttpException } from './HttpException';

export class ForbiddenException extends HttpException {

  constructor(message?: string, details?: Object) {
    super(HttpStatusCodes.FORBIDDEN, message || 'You are not allowed to access this resource.', details);
  }

}
