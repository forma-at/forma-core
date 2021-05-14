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
  '/forgotPassword',
  validate([
    body('email').isString(),
  ]),
  userControllers.forgotPassword,
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
  userControllers.createAccount,
);

router.get(
  '/:userId',
  authorization,
  userControllers.getAccountInfo,
);

router.delete(
  '/:userId',
  authorization,
  userControllers.deleteAccount,
);

router.post(
  '/:userId/verify',
  validate([
    body('code').isString(),
  ]),
  userControllers.verifyAccount,
);

router.post(
  '/:userId/update',
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
  '/:userId/password/reset',
  validate([
    body('code').isString(),
    body('password').isString(),
  ]),
  userControllers.resetPassword,
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
