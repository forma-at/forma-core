import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { teacherService, abilityService, membershipService, classService } from '../services';
import { Subject, Language } from '../models';

export const getTeacherSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = Object.values(Subject);
    const languages = Object.values(Language);
    return res.status(HttpStatusCodes.OK).json({ ok: true, subjects, languages });
  } catch (err) {
    return next(err);
  }
};

export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const { subjects, languages }: Body.CreateTeacher = req.body;
  try {
    abilityService.assureCan(req.user, 'create', 'Teacher');
    const teacher = await teacherService.createTeacher(req.user, subjects, languages);
    return res.status(HttpStatusCodes.CREATED).json({ ok: true, teacher });
  } catch (err) {
    return next(err);
  }
};

export const getTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const { teacherId } = req.params;
  try {
    const teacher = await teacherService.getTeacherById(teacherId);
    abilityService.assureCan(req.user, 'read', teacher);
    return res.status(HttpStatusCodes.OK).json({ ok: true, teacher });
  } catch (err) {
    return next(err);
  }
};

export const updateTeacher = async (req: Request, res: Response, next: NextFunction) => {
  const { teacherId } = req.params;
  const { subjects, languages }: Body.UpdateTeacher = req.body;
  try {
    const teacher = await teacherService.getTeacherById(teacherId);
    abilityService.assureCan(req.user, 'update', teacher);
    const updatedTeacher = await teacherService.updateTeacher(teacher, subjects, languages);
    return res.status(HttpStatusCodes.OK).json({ ok: true, teacher: updatedTeacher });
  } catch (err) {
    return next(err);
  }
};

export const getSchools = async (req: Request, res: Response, next: NextFunction) => {
  const { teacherId } = req.params;
  try {
    const teacher = await teacherService.getTeacherById(teacherId);
    abilityService.assureCan(req.user, 'read', teacher);
    const schools = await membershipService.getWithSchoolDataByTeacher(teacher);
    return res.status(HttpStatusCodes.OK).json({ ok: true, schools });
  } catch (err) {
    return next(err);
  }
};

export const getClasses = async (req: Request, res: Response, next: NextFunction) => {
  const { teacherId } = req.params;
  const { start, end } = req.query as { [key: string]: string };
  try {
    const teacher = await teacherService.getTeacherById(teacherId);
    abilityService.assureCan(req.user, 'read', teacher);
    const classes = await classService.getClassesByTeacher(teacher, parseInt(start, 10), parseInt(end, 10));
    return res.status(HttpStatusCodes.OK).json({ ok: true, classes });
  } catch (err) {
    return next(err);
  }
};
