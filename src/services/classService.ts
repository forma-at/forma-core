import { v4 as uuid } from 'uuid';
import validator from 'validator';
import { classRepository } from '../repositories';
import { Class } from '../models';
import { NotFoundException, ValidationException } from '../exceptions';

class ClassService {}

export const classService = new ClassService();
