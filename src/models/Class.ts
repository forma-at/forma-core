import { Subject } from './Subject';
import { Language } from './Language';

export class Class {
  id: string;
  schoolId: string;
  teacherId?: string;
  subject: Subject;
  language: Language;
  group: string;
  start: number;
  end: number;
  description?: string;
  createdAt: number;
  updatedAt: number;
}
