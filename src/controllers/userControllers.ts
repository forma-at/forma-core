import { Request, Response, NextFunction, Body } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import { userService, expiringCodeService, emailService } from '../services';

export const getUserInfo = async (req: Request, res: Response) => {
  const user = req.user;
  res.status(HttpStatusCodes.OK).json({ user });
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: Body.Signin = req.body;
  try {
    const user = await userService.signin(email, password);
    const token = await userService.createJWT(user);
    res.status(HttpStatusCodes.OK).json({ token });
  } catch (err) {
    next(err);
  }
};

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password }: Body.Signup = req.body;
  try {
    const user = await userService.createAccount(email, firstName, lastName, password);
    const { code } = await expiringCodeService.addEmailVerificationCode(user.email);
    await emailService.sendEmail(user, 'accountCreated', { code });
    res.status(HttpStatusCodes.CREATED).json({ user });
  } catch (err) {
    next(err);
  }
};

export const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { email, code }: Body.VerifyAccount = req.body;
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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email }: Body.ForgotPassword = req.body;
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

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, code, password }: Body.ResetPassword = req.body;
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
