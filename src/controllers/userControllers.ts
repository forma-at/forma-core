import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { userService, expiringCodeService, emailService } from '../services';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const user = await userService.signup(email, firstName, lastName, password);
    const { code } = await expiringCodeService.addEmailVerificationCode(user.email);
    await emailService.sendEmail(user, 'accountCreated', { code });
    res.status(HttpStatusCodes.OK).json({ user });
  } catch (err) {
    next(err);
  }
};

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

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  const { email, code } = req.body;
  try {
    const isValid = await expiringCodeService.checkEmailVerificationCode(email, code);
    if (!isValid) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: 'The code is invalid or expired.',
      });
    } else {
      const user = await userService.verifyAccount(email);
      await emailService.sendEmail(user, 'accountVerified');
      res.status(HttpStatusCodes.OK).json({ user });
    }
  } catch (err) {
    next(err);
  }
};

export const forgot = (req: Request, res: Response) => {};

export const reset = (req: Request, res: Response) => {};
