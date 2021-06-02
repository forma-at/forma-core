import { abilityService, AppAbility } from '../services';

export const USER_TYPE = {
  TEACHER: 'TEACHER' as const,
  SCHOOL: 'SCHOOL' as const,
};

export type UserType = keyof typeof USER_TYPE;

export class User {

  id: string;
  type: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  emailConfirmed: boolean;
  schoolId?: string;
  teacherId?: string;
  language: string;
  createdAt: number;
  updatedAt: number;

  readonly ability: AppAbility;

  constructor(user: User) {
    Object.assign(this, user);
    this.ability = abilityService.defineFor(this);
  }

}

export type SanitizedUser = Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'emailConfirmed'>;
