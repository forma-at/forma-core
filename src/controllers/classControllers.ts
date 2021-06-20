import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';

export const getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
      message: 'This feature is not yet implemented.',
    });
  } catch (err) {
    return next(err);
  }
};

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
      message: 'This feature is not yet implemented.',
    });
  } catch (err) {
    return next(err);
  }
};

export const getClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
      message: 'This feature is not yet implemented.',
    });
  } catch (err) {
    return next(err);
  }
};

export const updateClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
      message: 'This feature is not yet implemented.',
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
      message: 'This feature is not yet implemented.',
    });
  } catch (err) {
    return next(err);
  }
};

export const reserveClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
      message: 'This feature is not yet implemented.',
    });
  } catch (err) {
    return next(err);
  }
};
