import { Subject } from './Subject';
import { Language } from './Language';

export class Teacher {
  id: string;
  userId: string;
  subjects: Subject[];
  languages: Language[];
  createdAt: number;
  updatedAt: number;

  constructor(teacher: Teacher) {
    Object.assign(this, teacher);
  }
}
