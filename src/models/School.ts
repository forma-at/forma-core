export interface Address {
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
}

export class School {
  id: string;
  userId: string;
  name: string;
  address: Address;
  description?: string;
  createdAt: number;
  updatedAt: number;

  constructor(school: School) {
    Object.assign(this, school);
  }
}
