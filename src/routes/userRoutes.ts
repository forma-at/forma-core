import { Router } from 'express';
import { validate, body, authorization } from '../middlewares';
import { userControllers } from '../controllers';

const router = Router();

router.get(
  '/',
  authorization,
  userControllers.getUserInfo,
);

router.post(
  '/login',
  validate([
    body('email').isString(),
    body('password').isString(),
  ]),
  userControllers.login,
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

router.post(
  '/verify',
  validate([
    body('email').isString(),
    body('code').isString(),
  ]),
  userControllers.verifyAccount,
);

router.post(
  '/forgotPassword',
  validate([
    body('email').isString(),
  ]),
  userControllers.forgotPassword,
);

router.post(
  '/resetPassword',
  validate([
    body('email').isString(),
    body('code').isString(),
    body('password').isString(),
  ]),
  userControllers.resetPassword,
);

export default router;
