export type Skill = string;

export class Teacher {
  id: string;
  userId: string;
  skills: Skill[];
  createdAt: number;
  updatedAt: number;

  constructor(teacher: Teacher) {
    Object.assign(this, teacher);
  }
}
