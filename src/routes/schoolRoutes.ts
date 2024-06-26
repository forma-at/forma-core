import { Router } from 'express';
import { validate, body, authorization, query } from '../middlewares';
import { schoolControllers } from '../controllers';

const router = Router();

router.get(
  '/public',
  authorization,
  schoolControllers.getPublicSchools,
);

router.put(
  '/',
  authorization,
  validate([
    body('name').isString(),
    body('street').isString(),
    body('city').isString(),
    body('zip').isString(),
    body('state').isString(),
    body('country').isString(),
    body('description').isString().optional(),
  ]),
  schoolControllers.createSchool,
);

router.get(
  '/:schoolId',
  authorization,
  schoolControllers.getSchool,
);

router.post(
  '/:schoolId',
  authorization,
  validate([
    body('name').isString().optional(),
    body('street').isString().optional(),
    body('city').isString().optional(),
    body('zip').isString().optional(),
    body('state').isString().optional(),
    body('country').isString().optional(),
    body('description').isString().optional(),
  ]),
  schoolControllers.updateSchool,
);

router.get(
  '/:schoolId/teachers',
  authorization,
  schoolControllers.getTeachers,
);

router.get(
  '/:schoolId/classes',
  authorization,
  validate([
    query('start').isString(),
    query('end').isString(),
  ]),
  schoolControllers.getClasses,
);

router.put(
  '/:schoolId/membership',
  authorization,
  schoolControllers.createMembership,
);

router.get(
  '/:schoolId/membership/:teacherId',
  authorization,
  schoolControllers.getMembership,
);

router.post(
  '/:schoolId/membership/:teacherId',
  authorization,
  validate([
    body('status').isString(),
  ]),
  schoolControllers.updateMembership,
);

router.delete(
  '/:schoolId/membership/:teacherId',
  authorization,
  schoolControllers.deleteMembership,
);

export default router;
