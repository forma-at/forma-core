class User {

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailConfirmed: boolean;

  constructor(user: User) {
    Object.assign(this, user);
  }

}

export default User;
