class School {

  id: string;
  name: string;
  email: string;
  password: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postal: string;
    region: string;
    country: string;
  }
  createdAt: number;
  updatedAt: number;

  constructor(school: School) {
    Object.assign(this, school);
  }

}

export default School;
