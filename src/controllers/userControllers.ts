import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { userService } from '../services';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const user = await userService.signup(email, firstName, lastName, password);
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

export const verify = (req: Request, res: Response) => {};

export const forgot = (req: Request, res: Response) => {};

export const reset = (req: Request, res: Response) => {};
