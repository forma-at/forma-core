import { Router } from 'express';
import classRoutes from './classRoutes';
import schoolRoutes from './schoolRoutes';
import teacherRoutes from './teacherRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/class', classRoutes);
router.use('/school', schoolRoutes);
router.use('/teacher', teacherRoutes);
router.use('/user', userRoutes);

export default router;
