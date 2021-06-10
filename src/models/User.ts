import { AppAbility } from '../services';

export enum UserType {
  school = 'school',
  teacher = 'teacher',
}

export class User {
  id: string;
  type: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  emailConfirmed: boolean;
  language: string;
  createdAt: number;
  updatedAt: number;

  constructor(user: User) {
    Object.assign(this, user);
  }
}

export class UserWithAbility extends User {
  readonly ability: AppAbility;

  constructor(user: User, ability: AppAbility) {
    super(user);
    this.ability = ability;
  }
}
