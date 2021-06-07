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

// export const getAllTeachers = async (req: Request, res: Response, next: NextFunction) => {
//   const { schoolId } = req.params;
//   try {
//     const school = await schoolService.getSchoolById(schoolId);
//     if (!school) {
//       return next(new NotFoundException('The school was not found.'));
//     } else {
//       abilityService.assureCan(req.user, 'detail', school);
//       const teachers = await teacherService.getTeachersBySchoolId(school.id);
//       return res.status(HttpStatusCodes.OK).json({ ok: true, teachers });
//     }
//   } catch (err) {
//     return next(err);
//   }
// };

// export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
//   const { schoolId } = req.params;
//   try {
//     const school = await schoolService.getSchoolById(schoolId);
//     if (!school) {
//       return next(new NotFoundException('The school was not found.'));
//     } else {
//       abilityService.assureCan(req.user, 'create', 'Teacher');
//       const teacher = await teacherService.createTeacher(req.user.id, school.id);
//       return res.status(HttpStatusCodes.CREATED).json({ ok: true, teacher });
//     }
//   } catch (err) {
//     return next(err);
//   }
// };

// export const getTeacher = async (req: Request, res: Response, next: NextFunction) => {
//   const { schoolId, teacherId } = req.params;
//   try {
//     const school = await schoolService.getSchoolById(schoolId);
//     if (!school) {
//       return next(new NotFoundException('The school was not found.'));
//     } else {
//       abilityService.assureCan(req.user, 'read', school);
//       const teacher = await teacherService.getTeacherByUserId(teacherId);
//       if (!teacher) {
//         return next(new NotFoundException('The teacher was not found.'));
//       } else {
//         abilityService.assureCan(req.user, 'read', teacher);
//         return res.status(HttpStatusCodes.OK).json({ ok: true, teacher });
//       }
//     }
//   } catch (err) {
//     return next(err);
//   }
// };

// export const updateTeacher = async (req: Request, res: Response, next: NextFunction) => {
//   const { schoolId, teacherId } = req.params;
//   const { status }: Body.UpdateTeacher = req.body;
//   try {
//     const school = await schoolService.getSchoolById(schoolId);
//     if (!school) {
//       return next(new NotFoundException('The school was not found.'));
//     } else {
//       abilityService.assureCan(req.user, 'read', school);
//       const teacher = await teacherService.getTeacherByUserId(teacherId);
//       if (!teacher) {
//         return next(new NotFoundException('The teacher was not found.'));
//       } else {
//         abilityService.assureCan(req.user, 'update', teacher);
//         const updatedTeacher = await teacherService.updateTeacherStatus(teacher.userId, status);
//         return res.status(HttpStatusCodes.OK).json({ ok: true, teacher: updatedTeacher });
//       }
//     }
//   } catch (err) {
//     return next(err);
//   }
// };

// export const deleteTeacher = async (req: Request, res: Response, next: NextFunction) => {
//   const { schoolId, teacherId } = req.params;
//   try {
//     const school = await schoolService.getSchoolById(schoolId);
//     if (!school) {
//       return next(new NotFoundException('The school was not found.'));
//     } else {
//       abilityService.assureCan(req.user, 'read', school);
//       const teacher = await teacherService.getTeacherByUserId(teacherId);
//       if (!teacher) {
//         return next(new NotFoundException('The teacher was not found.'));
//       } else {
//         abilityService.assureCan(req.user, 'delete', teacher);
//         await teacherService.deleteTeacher(teacher.userId);
//         return res.status(HttpStatusCodes.OK).json({ ok: true });
//       }
//     }
//   } catch (err) {
//     return next(err);
//   }
// };
