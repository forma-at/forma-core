import { Subject } from './Subject';
import { Language } from './Language';

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Subgrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export class Class {
  id: string;
  schoolId: string;
  teacherId?: string;
  subject: Subject;
  language: Language;
  grade: Grade;
  subgrade?: Subgrade;
  description?: string;
  start: number;
  end: number;
  createdAt: number;
  updatedAt: number;
}
