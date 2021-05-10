class User {

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  emailConfirmed: boolean;
  isSchoolAdmin: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(user: User) {
    Object.assign(this, user);
  }

}

export default User;
