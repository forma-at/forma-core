import { Router } from 'express';
import { validate, body, authorization } from '../middlewares';
import { schoolControllers } from '../controllers';

const router = Router();

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
  '/:schoolId/member',
  authorization,
  schoolControllers.getSchoolMembers,
);

router.put(
  '/:schoolId/member',
  authorization,
  validate([
    body('teacherId').isString(),
  ]),
  schoolControllers.createSchoolMember,
);

router.get(
  '/:schoolId/member/:teacherId',
  authorization,
  schoolControllers.getSchoolMember,
);

router.post(
  '/:schoolId/member/:teacherId',
  authorization,
  validate([
    body('status').isString(),
  ]),
  schoolControllers.updateSchoolMember,
);

router.delete(
  '/:schoolId/member/:teacherId',
  authorization,
  schoolControllers.deleteSchoolMember,
);

export default router;
