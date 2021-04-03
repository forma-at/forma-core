import { Router } from 'express';
import userRoutes from './userRoutes';
import schoolRoutes from './schoolRoutes';

const router = Router();

router.use('/user', userRoutes);
router.use('/school', schoolRoutes);

export default router;
