import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { schoolRepository } from '../repositories';
import { ValidationException } from '../exceptions';
import { School } from '../models';

class SchoolService {

  //

}

export const schoolService = new SchoolService();
