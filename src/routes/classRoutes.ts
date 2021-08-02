import { Router } from 'express';
import { validate, body, authorization } from '../middlewares';
import { classControllers } from '../controllers';

const router = Router();

router.put(
  '/',
  authorization,
  validate([
    body('schoolId').isString(),
    body('subject').isString(),
    body('language').isString(),
    body('grade').isNumeric(),
    body('subgrade').isString().optional(),
    body('description').isString().optional(),
    body('start').isNumeric(),
    body('end').isNumeric(),
  ]),
  classControllers.createClass,
);

router.get(
  '/:classId',
  authorization,
  classControllers.getClass,
);

router.post(
  '/:classId',
  authorization,
  validate([
    body('subject').isString().optional(),
    body('language').isString().optional(),
    body('grade').isNumeric().optional(),
    body('subgrade').isString().optional(),
    body('description').isString().optional(),
    body('start').isNumeric().optional(),
    body('end').isNumeric().optional(),
  ]),
  classControllers.updateClass,
);

router.delete(
  '/:classId',
  authorization,
  classControllers.deleteClass,
);

router.post(
  '/:classId/reserve',
  authorization,
  classControllers.reserveClass,
);

export default router;
