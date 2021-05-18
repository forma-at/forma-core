type TeacherStatus = 'active' | 'pending';

export class Teacher {

  userId: string;
  schoolId: string;
  status: TeacherStatus;
  createdAt: number;
  updatedAt: number;

  constructor(teacher: Teacher) {
    Object.assign(this, teacher);
  }

}
