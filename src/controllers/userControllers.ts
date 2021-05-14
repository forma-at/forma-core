import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { userService, expiringCodeService, emailService, abilityService } from '../services';
import { ValidationException, NotFoundException } from '../exceptions';

export const getAccountInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = req.user;
    if (user.id !== userId) {
      return next(new NotFoundException('The user was not found.'));
    } else {
      return res.status(HttpStatusCodes.OK).json({ user });
    }
  } catch (err) {
    return next(err);
  }
};

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

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password, phone, isSchoolAdmin, language }: Body.CreateAccount = req.body;
  try {
    const user = await userService.createAccount(email, firstName, lastName, password, isSchoolAdmin, language, phone);
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

export const deleteAccount = async (req: Request, res: Response, _next: NextFunction) => {
  console.log('Delete account', req.user.id, req.params.userId);
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).json({
    message: 'This feature is not yet implemented.',
  });
};

export const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { code }: Body.VerifyAccount = req.body;
  try {
    const user = await userService.getUserById(userId);
    const isCodeValid = await expiringCodeService.checkEmailVerificationCode(userId, code);
    if (!user || !isCodeValid) {
      return next(new NotFoundException('The code is invalid or expired.'));
    } else {
      await userService.verifyAccount(user);
      await emailService.sendEmail(user, 'accountVerified');
      return res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    return next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { code, password }: Body.ResetPassword = req.body;
  try {
    const user = await userService.getUserById(userId);
    const isCodeValid = await expiringCodeService.checkForgotPasswordCode(userId, code);
    if (!user || !isCodeValid) {
      return next(new NotFoundException('The code is invalid or expired.'));
    } else {
      await userService.changePassword(user, password);
      await emailService.sendEmail(user, 'passwordReset');
      return res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    return next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { email, phone, firstName, lastName, password, currentPassword }: Body.UpdateUser = req.body;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return next(new NotFoundException('The user was not found.'));
    } else {
      abilityService.assure(req.user, 'update', user);
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
      abilityService.assure(req.user, 'update', user);
      const updatedUser = await userService.updateLanguage(user, language);
      return res.status(HttpStatusCodes.OK).json({ ok: true, user: updatedUser });
    }
  } catch (err) {
    return next(err);
  }
};
