export type UserType = 'teacher' | 'admin';

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
  createdAt: number;
  updatedAt: number;

  constructor(user: User) {
    Object.assign(this, user);
  }

}
