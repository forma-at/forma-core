import { Request, Response, NextFunction, JWTPayload } from 'Router';
import HttpStatusCodes from 'http-status-codes';
import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import { abilityService, schoolService, teacherService, userService } from '../services';
import { UserWithAbility, UserType } from '../models';

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
          const user = await userService.getUserById(decoded.userId);
          if (!user) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
              message: 'Authorization token invalid.',
            });
          } else {
            let ability;
            if (user.type === UserType.school) {
              try {
                const school = await schoolService.getSchoolByUserId(user.id);
                ability = abilityService.defineFor(user, { school });
              } catch (error) {
                ability = abilityService.defineFor(user, {});
              }
            } else if (user.type === UserType.teacher) {
              try {
                const teacher = await teacherService.getTeacherByUserId(user.id);
                ability = abilityService.defineFor(user, { teacher });
              } catch (error) {
                ability = abilityService.defineFor(user, {});
              }
            }
            req.user = new UserWithAbility(user, ability);
            return next();
          }
        }
      });
    }
  }
};
