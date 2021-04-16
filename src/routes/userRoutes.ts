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
  '/signin',
  validate([
    body('email').isEmail(),
    body('password').isString(),
  ]),
  userControllers.signin,
);

router.put(
  '/',
  validate([
    body('email').isEmail(),
    body('firstName').isString(),
    body('lastName').isString(),
    body('password').isString(),
  ]),
  userControllers.createAccount,
);

router.post(
  '/verify',
  validate([
    body('email').isEmail(),
    body('code').isString(),
  ]),
  userControllers.verifyAccount,
);

router.post(
  '/forgotPassword',
  validate([
    body('email').isEmail(),
  ]),
  userControllers.forgotPassword,
);

router.post(
  '/resetPassword',
  validate([
    body('email').isEmail(),
    body('code').isString(),
    body('password').isString(),
  ]),
  userControllers.resetPassword,
);

export default router;
