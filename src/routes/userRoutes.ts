import { Router } from 'express';
import { validate, body } from '../middlewares';
import { userControllers } from '../controllers';

const router = Router();

router.post(
  '/signin',
  validate([
    body('email').isEmail(),
    body('password').isString(),
  ]),
  userControllers.signin,
);

router.post(
  '/signup',
  validate([
    body('email').isEmail(),
    body('firstName').isString(),
    body('lastName').isString(),
    body('password').isString(),
  ]),
  userControllers.signup,
);

router.post(
  '/verify',
  validate([
    body('email').isEmail(),
    body('code').isString(),
  ]),
  userControllers.verify,
);

router.post(
  '/forgot',
  validate([
    body('email').isEmail(),
  ]),
  userControllers.forgot,
);

router.post(
  '/reset',
  validate([
    body('email').isEmail(),
    body('code').isString(),
    body('password').isString(),
  ]),
  userControllers.reset,
);

export default router;
