import { BaseRepository } from '../utils';
import { Class } from '../models';

class ClassRepository extends BaseRepository<Class> {

  constructor() {
    super(Class, 'classes');
  }

}

export const classRepository = new ClassRepository();
