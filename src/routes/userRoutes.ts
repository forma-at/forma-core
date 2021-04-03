import { Router } from 'express';
import { userControllers } from '../controllers';

const router = Router();

router.post('/signin', userControllers.signin);

router.post('/signup', userControllers.signup);

router.post('/verify', userControllers.verify);

router.post('/forgot', userControllers.forgot);

router.post('/reset', userControllers.reset);

export default router;
