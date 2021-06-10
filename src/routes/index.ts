import { Router } from 'express';
import schoolRoutes from './schoolRoutes';
import teacherRoutes from './teacherRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/school', schoolRoutes);
router.use('/teacher', teacherRoutes);
router.use('/user', userRoutes);

export default router;
