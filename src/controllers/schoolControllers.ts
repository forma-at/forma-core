import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { userService, schoolService, abilityService } from '../services';

export const createSchool = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, street, city, zip, state, country }: Body.CreateSchool = req.body;
  try {
    abilityService.assure(req.user, 'create', 'School');
    const school = await schoolService.createSchool(name, description, { street, city, zip, state, country });
    await userService.assignSchool(req.user, school);
    return res.status(HttpStatusCodes.OK).json({ ok: true, school });
  } catch (err) {
    return next(err);
  }
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
