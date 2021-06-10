import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { schoolService, abilityService } from '../services';

export const createSchool = async (req: Request, res: Response, next: NextFunction) => {
  const { name, street, city, zip, state, country, description }: Body.CreateSchool = req.body;
  try {
    abilityService.assureCan(req.user, 'create', 'School');
    const address = { street, city, zip, state, country };
    const school = await schoolService.createSchool(req.user, name, address, description);
    return res.status(HttpStatusCodes.CREATED).json({ ok: true, school });
  } catch (err) {
    return next(err);
  }
};

export const getSchool = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    abilityService.assureCan(req.user, 'read', school);
    return res.status(HttpStatusCodes.OK).json({ ok: true, school });
  } catch (err) {
    return next(err);
  }
};

export const updateSchool = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  const { name, street, city, zip, state, country, description }: Body.UpdateSchool = req.body;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    abilityService.assureCan(req.user, 'update', school);
    const address = { street, city, zip, state, country };
    const updatedSchool = await schoolService.updateSchool(school, name, address, description);
    return res.status(HttpStatusCodes.OK).json({ ok: true, school: updatedSchool });
  } catch (err) {
    return next(err);
  }
};
