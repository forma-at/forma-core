import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { schoolService, abilityService, teacherService, membershipService } from '../services';

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

export const getMemberships = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    abilityService.assureCan(req.user, 'read', school);
    const memberships = await membershipService.getMany(school.id);
    res.status(HttpStatusCodes.OK).json({ ok: true, memberships });
  } catch (err) {
    return next(err);
  }
};

export const createMembership = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    abilityService.assureCan(req.user, 'create', 'Membership');
    const teacher = await teacherService.getTeacherByUserId(req.user.id);
    const membership = await membershipService.create(school.id, teacher.id);
    return res.status(HttpStatusCodes.CREATED).json({ ok: true, membership });
  } catch (err) {
    return next(err);
  }
};

export const getMembership = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId, teacherId } = req.params;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    const teacher = await teacherService.getTeacherById(teacherId);
    const membership = await membershipService.getOne(school.id, teacher.id);
    abilityService.assureCan(req.user, 'read', membership);
    res.status(HttpStatusCodes.OK).json({ ok: true, membership });
  } catch (err) {
    return next(err);
  }
};

export const updateMembership = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId, teacherId } = req.params;
  const { status }: Body.UpdateMembership = req.body;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    const teacher = await teacherService.getTeacherById(teacherId);
    const membership = await membershipService.getOne(school.id, teacher.id);
    abilityService.assureCan(req.user, 'update', membership);
    const updatedMembership = await membershipService.update(membership, status);
    res.status(HttpStatusCodes.OK).json({ ok: true, membership: updatedMembership });
  } catch (err) {
    return next(err);
  }
};

export const deleteMembership = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId, teacherId } = req.params;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    const teacher = await teacherService.getTeacherById(teacherId);
    const membership = await membershipService.getOne(school.id, teacher.id);
    abilityService.assureCan(req.user, 'delete', membership);
    await membershipService.delete(membership);
    res.status(HttpStatusCodes.OK).json({ ok: true });
  } catch (err) {
    return next(err);
  }
};
