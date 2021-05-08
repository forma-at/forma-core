class School {

  id: string;
  adminId: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    zip: string;
    state: string;
    country: string;
  };
  createdAt: number;
  updatedAt: number;

  constructor(school: School) {
    Object.assign(this, school);
  }

}

export default School;
