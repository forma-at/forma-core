import { Router } from 'express';
import { schoolControllers } from '../controllers';

const router = Router();

router.post('/signin', schoolControllers.signin);

router.post('/signup', schoolControllers.signup);

router.post('/verify', schoolControllers.verify);

router.post('/forgot', schoolControllers.forgot);

router.post('/reset', schoolControllers.reset);

export default router;
