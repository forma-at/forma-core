import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { HttpException } from '../exceptions';

export const errorHandler = async (error: HttpException, req: Request, res: Response, _next: NextFunction) => {
  const status = error.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong. Please try again.';
  const details = error.details ? { details: error.details } : {};
  if (status === HttpStatusCodes.INTERNAL_SERVER_ERROR) console.error(error);
  res.status(status).json({
    status,
    message,
    ...details,
  });
};
