import { subject, language } from 'skills';

export class User {

  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  subjects: subject[];
  languages: language[];
  locations: string[];

  private constructor(user: { [key: string]: any }) {
    Object.assign(this, user);
  }

}
