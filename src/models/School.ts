export class School {

  uuid: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postal: string;
    region: string;
    country: string;
  }

  private constructor(school: { [key: string]: any }) {
    Object.assign(this, school);
  }

}
