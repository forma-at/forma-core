import HttpStatusCodes from 'http-status-codes';
import { ValidationError } from 'express-validator';
import { HttpException } from './HttpException';

export class ValidationException extends HttpException {

  constructor(details: ValidationError[]) {
    super(HttpStatusCodes.BAD_REQUEST, 'Request validation has failed.', details);
  }

}
