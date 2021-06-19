import { Router } from 'express';
import { validate, body, authorization } from '../middlewares';
import { teacherControllers } from '../controllers';

const router = Router();

router.get(
  '/skills',
  authorization,
  teacherControllers.getTeacherSkills,
);

router.put(
  '/',
  authorization,
  validate([
    body('subjects').isArray(),
    body('languages').isArray(),
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
    body('subjects').isArray().optional(),
    body('languages').isArray().optional(),
  ]),
  teacherControllers.updateTeacher,
);

router.get(
  '/:teacherId/schools',
  authorization,
  teacherControllers.getSchools,
);

export default router;
