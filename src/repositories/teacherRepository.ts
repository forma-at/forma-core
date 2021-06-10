import { BaseRepository } from '../utils';
import { Teacher } from '../models';

class TeacherRepository extends BaseRepository<Teacher> {

  constructor() {
    super(Teacher, 'teachers');
  }

}

export const teacherRepository = new TeacherRepository();
