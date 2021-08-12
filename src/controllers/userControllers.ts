import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import {
  userService,
  expiringCodeService,
  emailService,
  abilityService,
  schoolService,
  teacherService,
  membershipService,
  classService,
} from '../services';
import { ValidationException, NotFoundException } from '../exceptions';
import { UserType } from '../models';

export const getSelfData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (user.type === UserType.school) {
      const school = await schoolService.getSchoolByUserId(user.id, true);
      if (school) {
        const teachers = await membershipService.getWithTeacherDataBySchool(school);
        const classes = await classService.getClassesBySchool(school);
        return res.status(HttpStatusCodes.OK).json({ ok: true, user, school, teachers, classes });
      }
      return res.status(HttpStatusCodes.OK).json({ ok: true, user });
    } else {
      const teacher = await teacherService.getTeacherByUserId(user.id, true);
      if (teacher) {
        const schools = await membershipService.getWithSchoolDataByTeacher(teacher);
        const classes = await classService.getClassesByTeacher(teacher);
        return res.status(HttpStatusCodes.OK).json({ ok: true, user, teacher, schools, classes });
      }
      return res.status(HttpStatusCodes.OK).json({ ok: true, user });
    }
  } catch (err) {
    return next(err);
  }
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: Body.Authenticate = req.body;
  try {
    const user = await userService.getUserByEmail(email, true);
    if (!user) {
      return next(new ValidationException('Invalid email address or password.'));
    } else {
      const doPasswordsMatch = await userService.comparePasswords(user, password);
      if (!doPasswordsMatch) {
        return next(new ValidationException('Invalid email address or password.'));
      } else {
        const token = await userService.createJWT(user);
        return res.status(HttpStatusCodes.OK).json({
          ok: true,
          token,
          userId: user.id,
        });
      }
    }
  } catch (err) {
    return next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email }: Body.ForgotPassword = req.body;
  try {
    const user = await userService.getUserByEmail(email, true);
    if (!user) {
      return res.status(HttpStatusCodes.OK).json({ ok: true });
    } else {
      const { code } = await expiringCodeService.addForgotPasswordCode(user.id);
      await emailService.sendEmail(user, 'passwordForgot', { code });
      return res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    return next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, code, password }: Body.ResetPassword = req.body;
  try {
    const user = await userService.getUserById(userId);
    const isCodeValid = await expiringCodeService.checkForgotPasswordCode(userId, code);
    if (!isCodeValid) {
      return next(new NotFoundException('The code is invalid or expired.'));
    } else {
      await userService.resetPassword(user, password);
      await emailService.sendEmail(user, 'passwordReset');
      return res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { type, email, firstName, lastName, password, phone, language }: Body.CreateUser = req.body;
  try {
    const user = await userService.createUser(type, email, firstName, lastName, password, language, phone);
    const { code } = await expiringCodeService.addEmailVerificationCode(user.id);
    await emailService.sendEmail(user, 'accountCreated', { code });
    const token = await userService.createJWT(user);
    return res.status(HttpStatusCodes.CREATED).json({
      ok: true,
      token,
      userId: user.id,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await userService.getUserById(userId);
    abilityService.assureCan(req.user, 'read', user);
    return res.status(HttpStatusCodes.OK).json({ ok: true, user });
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { currentPassword }: Body.DeleteUser = req.body;
  try {
    const user = await userService.getUserById(userId);
    abilityService.assureCan(req.user, 'delete', user);
    await userService.deleteUser(user, currentPassword);
    if (user.type === UserType.school) {
      const school = await schoolService.getSchoolByUserId(user.id, true);
      if (school) {
        await schoolService.deleteSchool(school);
        await membershipService.deleteBySchoolId(school.id);
      }
    } else if (user.type === UserType.teacher) {
      const teacher = await teacherService.getTeacherByUserId(user.id, true);
      if (teacher) {
        await teacherService.deleteTeacher(teacher);
        await membershipService.deleteByTeacherId(teacher.id);
      }
    }
    return res.status(HttpStatusCodes.OK).json({ ok: true });
  } catch (err) {
    return next(err);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { code }: Body.VerifyUser = req.body;
  try {
    const user = await userService.getUserById(userId);
    const isCodeValid = await expiringCodeService.checkEmailVerificationCode(userId, code);
    if (!isCodeValid) {
      return next(new NotFoundException('The code is invalid or expired.'));
    } else {
      abilityService.assureCan(req.user, 'update', user);
      const updatedUser = await userService.verifyUser(user);
      await emailService.sendEmail(user, 'accountVerified');
      return res.status(HttpStatusCodes.OK).json({ ok: true, user: updatedUser });
    }
  } catch (err) {
    return next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { email, phone, firstName, lastName, password, currentPassword }: Body.UpdateProfile = req.body;
  try {
    const user = await userService.getUserById(userId);
    abilityService.assureCan(req.user, 'update', user);
    const updatedUser = await userService.updateProfile(user, currentPassword, {
      email, phone, firstName, lastName, password,
    });
    return res.status(HttpStatusCodes.OK).json({ ok: true, user: updatedUser });
  } catch (err) {
    return next(err);
  }
};

export const updateLanguage = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { language }: Body.UpdateLanguage = req.body;
  try {
    const user = await userService.getUserById(userId);
    abilityService.assureCan(req.user, 'update', user);
    const updatedUser = await userService.updateLanguage(user, language);
    return res.status(HttpStatusCodes.OK).json({ ok: true, user: updatedUser });
  } catch (err) {
    return next(err);
  }
};
