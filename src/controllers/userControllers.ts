import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { userService, expiringCodeService, emailService } from '../services';

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await userService.signin(email, password);
    const token = await userService.createJWT(user);
    res.status(HttpStatusCodes.OK).json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const user = await userService.createAccount(email, firstName, lastName, password);
    const { code } = await expiringCodeService.addEmailVerificationCode(user.email);
    await emailService.sendEmail(user, 'accountCreated', { code });
    res.status(HttpStatusCodes.OK).json({ user });
  } catch (err) {
    next(err);
  }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  const { email, code } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    const isCodeValid = await expiringCodeService.checkEmailVerificationCode(email, code);
    if (!user || !isCodeValid) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'The code is invalid or expired.',
      });
    } else {
      await userService.verifyAccount(user);
      await emailService.sendEmail(user, 'accountVerified');
      res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    next(err);
  }
};

export const forgot = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      res.status(HttpStatusCodes.OK).json({ ok: true });
    } else {
      const { code } = await expiringCodeService.addForgotPasswordCode(user.email);
      await emailService.sendEmail(user, 'passwordForgot', { code });
      res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    next(err);
  }
};

export const reset = async (req: Request, res: Response, next: NextFunction) => {
  const { email, code, password } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    const isCodeValid = await expiringCodeService.checkForgotPasswordCode(email, code);
    if (!user || !isCodeValid) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'The code is invalid or expired.',
      });
    } else {
      await userService.changePassword(user, password);
      await emailService.sendEmail(user, 'passwordReset');
      res.status(HttpStatusCodes.OK).json({ ok: true });
    }
  } catch (err) {
    next(err);
  }
};
