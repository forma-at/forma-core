import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { schoolService, abilityService, teacherService, membershipService, classService } from '../services';

export const getPublicSchools = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schools = await schoolService.getPublicSchools();
    return res.status(HttpStatusCodes.OK).json({ ok: true, schools });
  } catch (err) {
    return next(err);
  }
};

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

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  try {
    const school = await schoolService.getSchoolById(schoolId);
    abilityService.assureCan(req.user, 'read', school);
    const teachers = await membershipService.getWithTeacherDataBySchool(school);
    return res.status(HttpStatusCodes.OK).json({ ok: true, teachers });
  } catch (err) {
    return next(err);
  }
};

export const getClasses = async (req: Request, res: Response, next: NextFunction) => {
  const { schoolId } = req.params;
  const { start, end } = req.query as { [key: string]: string };
  try {
    const school = await schoolService.getSchoolById(schoolId);
    abilityService.assureCan(req.user, 'read', school);
    const classes = await classService.getClassesBySchool(school, parseInt(start, 10), parseInt(end, 10));
    return res.status(HttpStatusCodes.OK).json({ ok: true, classes });
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
    const withSchoolData = await membershipService.withSchoolData(membership);
    return res.status(HttpStatusCodes.CREATED).json({ ok: true, membership: withSchoolData });
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
    const withTeacherData = await membershipService.withTeacherData(updatedMembership);
    res.status(HttpStatusCodes.OK).json({ ok: true, membership: withTeacherData });
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
