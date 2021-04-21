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
  '/:userId/password',
  authorization,
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
  userControllers.updateProfile,
);

router.post(
  '/:userId/language',
  authorization,
  userControllers.updateLanguage,
);

export default router;
