export type Skill = string;

export class Teacher {
  id: string;
  userId: string;
  skills: Skill[];

  constructor(teacher: Teacher) {
    Object.assign(this, teacher);
  }
}
