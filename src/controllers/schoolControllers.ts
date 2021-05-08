import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';

export const createSchool = async (req: Request, res: Response, _next: NextFunction) => {
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    message: 'This feature is not yet implemented.',
  });
};

export const getSchoolData = async (req: Request, res: Response, _next: NextFunction) => {
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    message: 'This feature is not yet implemented.',
  });
};

export const deleteSchool = async (req: Request, res: Response, _next: NextFunction) => {
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    message: 'This feature is not yet implemented.',
  });
};

export const updateSchool = async (req: Request, res: Response, _next: NextFunction) => {
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    message: 'This feature is not yet implemented.',
  });
};
