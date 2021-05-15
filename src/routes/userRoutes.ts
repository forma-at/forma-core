import { Router } from 'express';
import { validate, body, authorization } from '../middlewares';
import { userControllers } from '../controllers';

const router = Router();

router.post(
  '/auth',
  validate([
    body('email').isString(),
    body('password').isString(),
  ]),
  userControllers.authenticate,
);

router.post(
  '/password/forgot',
  validate([
    body('email').isString(),
  ]),
  userControllers.forgotPassword,
);

router.post(
  '/password/reset',
  validate([
    body('userId').isString(),
    body('code').isString(),
    body('password').isString(),
  ]),
  userControllers.resetPassword,
);

router.put(
  '/',
  validate([
    body('email').isString(),
    body('firstName').isString(),
    body('lastName').isString(),
    body('password').isString(),
    body('phone').isString().optional(),
    body('isSchoolAdmin').isBoolean(),
    body('language').isString(),
  ]),
  userControllers.createUser,
);

router.get(
  '/:userId',
  authorization,
  userControllers.getUserData,
);

router.delete(
  '/:userId',
  authorization,
  validate([
    body('currentPassword').isString(),
  ]),
  userControllers.deleteUser,
);

router.post(
  '/:userId/verify',
  authorization,
  validate([
    body('code').isString(),
  ]),
  userControllers.verifyUser,
);

router.post(
  '/:userId/profile',
  authorization,
  validate([
    body('email').isString().optional(),
    body('phone').isString().optional(),
    body('firstName').isString().optional(),
    body('lastName').isString().optional(),
    body('password').isString().optional(),
    body('currentPassword').isString(),
  ]),
  userControllers.updateProfile,
);

router.post(
  '/:userId/language',
  authorization,
  validate([
    body('language').isString(),
  ]),
  userControllers.updateLanguage,
);

export default router;
