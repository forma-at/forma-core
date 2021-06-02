export type Skill = string;

export class Teacher {
  id: string;
  skills: Skill[];

  constructor(teacher: Teacher) {
    Object.assign(this, teacher);
  }
}
