import { Router } from 'express';
import { validate, body, authorization } from '../middlewares';
import { schoolControllers } from '../controllers';

const router = Router();

router.put(
  '/',
  authorization,
  validate([
    body('name').isString(),
    body('description').isString(),
    body('street').isString(),
    body('city').isString(),
    body('zip').isString(),
    body('state').isString(),
    body('country').isString(),
  ]),
  schoolControllers.createSchool,
);

router.get(
  '/:schoolId',
  authorization,
  schoolControllers.getSchoolData,
);

router.post(
  '/:schoolId/update',
  authorization,
  validate([
    body('name').isString().optional(),
    body('description').isString().optional(),
    body('street').isString().optional(),
    body('city').isString().optional(),
    body('zip').isString().optional(),
    body('state').isString().optional(),
    body('country').isString().optional(),
    body('currentPassword').isString(),
  ]),
  schoolControllers.updateSchool,
);

export default router;
