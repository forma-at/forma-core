import { SanitizedUser } from './User';

export const TEACHER_STATUS = {
  PENDING: 'PENDING' as const,
  ACTIVE: 'ACTIVE' as const,
  REJECTED: 'REJECTED' as const,
};

export type TeacherStatus = keyof typeof TEACHER_STATUS;

export class Teacher {

  userId: string;
  schoolId: string;
  status: TeacherStatus;
  details?: SanitizedUser;
  createdAt: number;
  updatedAt: number;

  constructor(teacher: Teacher) {
    Object.assign(this, teacher);
  }

}
