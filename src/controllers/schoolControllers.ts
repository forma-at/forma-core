import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { userService, schoolService, abilityService } from '../services';
import { NotFoundException } from '../exceptions';

export const createSchool = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, street, city, zip, state, country }: Body.CreateSchool = req.body;
  try {
    abilityService.assureCan(req.user, 'create', 'School');
    const school = await schoolService.createSchool(name, description, {
      street, city, zip, state, country
    });
    await userService.assignSchool(req.user, school);
    return res.status(HttpStatusCodes.CREATED).json({ ok: true, school });
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
      abilityService.assureCan(req.user, 'read', school);
      return res.status(HttpStatusCodes.OK).json({ ok: true, school });
    }
  } catch (err) {
    return next(err);
  }
};

export const updateSchool = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  const { name, description, street, city, zip, state, country }: Body.UpdateSchool = req.body;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    if (!school) {
      return next(new NotFoundException('The school was not found.'));
    } else {
      abilityService.assureCan(req.user, 'update', school);
      const updatedSchool = await schoolService.updateSchool(school, name, description, {
        street, city, zip, state, country
      });
      return res.status(HttpStatusCodes.OK).json({ ok: true, school: updatedSchool });
    }
  } catch (err) {
    return next(err);
  }
};
