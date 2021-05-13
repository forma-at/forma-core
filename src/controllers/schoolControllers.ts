import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { userService, schoolService, abilityService } from '../services';
import { NotFoundException } from '../exceptions';

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

export const getSchoolData = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    if (!school) {
      return next(new NotFoundException('The school was not found.'));
    } else {
      abilityService.assure(req.user, 'read', school);
      return res.status(HttpStatusCodes.OK).json({ ok: true, school });
    }
  } catch (err) {
    return next(err);
  }
};

export const updateSchool = async (req: Request, res: Response, _next: NextFunction) => {
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    message: 'This feature is not yet implemented.',
  });
};
