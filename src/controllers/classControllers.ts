import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { abilityService, classService, schoolService, teacherService } from '../services';

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
  const { subject, language, grade, start, end, description }: Body.CreateClass = req.body;
  try {
    abilityService.assureCan(req.user, 'create', 'Class');
    const school = await schoolService.getSchoolByUserId(req.user.id);
    const createdClass = await classService.create(school, subject, language, grade, start, end, description);
    return res.status(HttpStatusCodes.CREATED).json({ ok: true, class: createdClass });
  } catch (err) {
    return next(err);
  }
};

export const getClass = async (req: Request, res: Response, next: NextFunction) => {
  const { classId } = req.params;
  try {
    const foundClass = await classService.getClassById(classId);
    abilityService.assureCan(req.user, 'read', foundClass);
    return res.status(HttpStatusCodes.OK).json({ ok: true, class: foundClass });
  } catch (err) {
    return next(err);
  }
};

export const updateClass = async (req: Request, res: Response, next: NextFunction) => {
  const { classId } = req.params;
  const { subject, language, grade, start, end, description }: Body.UpdateClass = req.body;
  try {
    const foundClass = await classService.getClassById(classId);
    abilityService.assureCan(req.user, 'update', foundClass);
    const updatedClass = await classService.update(foundClass, subject, language, grade, start, end, description);
    return res.status(HttpStatusCodes.OK).json({ ok: true, class: updatedClass });
  } catch (err) {
    return next(err);
  }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction) => {
  const { classId } = req.params;
  try {
    const foundClass = await classService.getClassById(classId);
    abilityService.assureCan(req.user, 'delete', foundClass);
    await classService.delete(foundClass);
    return res.status(HttpStatusCodes.OK).json({ ok: true });
  } catch (err) {
    return next(err);
  }
};

export const reserveClass = async (req: Request, res: Response, next: NextFunction) => {
  const { classId } = req.params;
  try {
    const foundClass = await classService.getClassById(classId);
    abilityService.assureCan(req.user, 'update', foundClass, 'teacherId');
    const teacher = await teacherService.getTeacherByUserId(req.user.id);
    const updatedClass = await classService.assign(foundClass, teacher.id);
    return res.status(HttpStatusCodes.OK).json({ ok: true, class: updatedClass });
  } catch (err) {
    return next(err);
  }
};

export const dropClass = async (req: Request, res: Response, next: NextFunction) => {
  const { classId } = req.params;
  try {
    const foundClass = await classService.getClassById(classId);
    abilityService.assureCan(req.user, 'update', foundClass, 'teacherId');
    const updatedClass = await classService.assign(foundClass, null);
    return res.status(HttpStatusCodes.OK).json({ ok: true, class: updatedClass });
  } catch (err) {
    return next(err);
  }
};
