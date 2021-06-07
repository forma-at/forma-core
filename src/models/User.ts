import { abilityService, AppAbility } from '../services';

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

  readonly ability: AppAbility;

  constructor(user: User) {
    Object.assign(this, user);
    this.ability = abilityService.defineFor(this);
  }
}
