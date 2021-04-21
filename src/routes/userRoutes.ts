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
  ]),
  userControllers.createAccount,
);

router.get(
  '/:userId',
  authorization,
  validate([]),
  userControllers.getAccountInfo,
);

router.delete(
  '/:userId',
  authorization,
  validate([]),
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
  '/:userId/password',
  authorization,
  validate([]),
  userControllers.updatePassword,
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
  '/:userId/profile',
  authorization,
  validate([]),
  userControllers.updateProfile,
);

router.post(
  '/:userId/language',
  authorization,
  validate([]),
  userControllers.updateLanguage,
);

export default router;
