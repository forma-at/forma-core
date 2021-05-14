import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { userService, expiringCodeService, emailService, abilityService } from '../services';
import { ValidationException, NotFoundException } from '../exceptions';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: Body.Authenticate = req.body;
  try {
    const user = await userService.getUserByEmail(email);
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
    const user = await userService.getUserByEmail(email);
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
    if (!user) {
      return next(new NotFoundException('The user was not found.'));
    } else {
      const isCodeValid = await expiringCodeService.checkForgotPasswordCode(userId, code);
      if (!isCodeValid) {
        return next(new NotFoundException('The code is invalid or expired.'));
      } else {
        await userService.resetPassword(user, password);
        await emailService.sendEmail(user, 'passwordReset');
        return res.status(HttpStatusCodes.OK).json({ ok: true });
      }
    }
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password, phone, isSchoolAdmin, language }: Body.CreateUser = req.body;
  try {
    const user = await userService.createUser(email, firstName, lastName, password, isSchoolAdmin, language, phone);
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

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return next(new NotFoundException('The user was not found.'));
    } else {
      abilityService.assureCan(req.user, 'read', user);
      return res.status(HttpStatusCodes.OK).json({ ok: true, user });
    }
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { currentPassword }: Body.DeleteUser = req.body;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return next(new NotFoundException('The user was not found.'));
    } else {
      abilityService.assureCan(req.user, 'delete', user);
      await userService.deleteUser(user, currentPassword);
      return res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    return next(err);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { code }: Body.VerifyUser = req.body;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return next(new NotFoundException('The user was not found'));
    } else {
      const isCodeValid = await expiringCodeService.checkEmailVerificationCode(userId, code);
      if (!isCodeValid) {
        return next(new NotFoundException('The code is invalid or expired.'));
      } else {
        abilityService.assureCan(req.user, 'update', user);
        const updatedUser = await userService.verifyUser(user);
        await emailService.sendEmail(user, 'accountVerified');
        return res.status(HttpStatusCodes.OK).json({ ok: true, user: updatedUser });
      }
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
    if (!user) {
      return next(new NotFoundException('The user was not found.'));
    } else {
      abilityService.assureCan(req.user, 'update', user);
      const updatedUser = await userService.updateProfile(user, currentPassword, {
        email, phone, firstName, lastName, password
      });
      return res.status(HttpStatusCodes.OK).json({ ok: true, user: updatedUser });
    }
  } catch (err) {
    return next(err);
  }
};

export const updateLanguage = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { language }: Body.UpdateLanguage = req.body;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return next(new NotFoundException('The user was not found.'));
    } else {
      abilityService.assureCan(req.user, 'update', user);
      const updatedUser = await userService.updateLanguage(user, language);
      return res.status(HttpStatusCodes.OK).json({ ok: true, user: updatedUser });
    }
  } catch (err) {
    return next(err);
  }
};
