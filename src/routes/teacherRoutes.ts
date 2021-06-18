import { Router } from 'express';
import { validate, body, authorization } from '../middlewares';
import { teacherControllers } from '../controllers';

const router = Router();

router.put(
  '/',
  authorization,
  validate([
    body('skills').isArray(),
  ]),
  teacherControllers.createTeacher,
);

router.get(
  '/:teacherId',
  authorization,
  teacherControllers.getTeacher,
);

router.post(
  '/:teacherId',
  authorization,
  validate([
    body('skills').isArray().optional(),
  ]),
  teacherControllers.updateTeacher,
);

router.get(
  '/:teacherId/schools',
  authorization,
  teacherControllers.getSchools,
);

export default router;
