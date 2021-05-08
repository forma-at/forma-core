import { BaseRepository } from './baseRepository';
import { School } from '../models';

class SchoolRepository extends BaseRepository<School> {

  constructor() {
    super(School, 'schools');
  }

}

export const schoolRepository = new SchoolRepository();
