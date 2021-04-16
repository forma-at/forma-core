import { Request, Response, NextFunction, JWTPayload } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import { userService } from '../services';

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
  const token = req?.headers?.authorization;
  if (!token) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'Authorization token missing.',
    });
  } else {
    const jwtToken = token.split('JWT ')[1];
    if (!jwtToken) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        message: 'Authorization token invalid.',
      });
    } else {
      jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET, async (err: VerifyErrors, decoded: JWTPayload) => {
        if (err) {
          return res.status(HttpStatusCodes.UNAUTHORIZED).json({
            message: 'Authorization token invalid.',
          });
        } else {
          req.user = await userService.getUserById(decoded.userId);
          if (!req.user) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
              message: 'Authorization token invalid.',
            });
          } else {
            return next();
          }
        }
      });
    }
  }
};
