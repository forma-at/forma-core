export interface Address {
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
}

export class School {

  id: string;
  name: string;
  description: string;
  address: Address;
  createdAt: number;
  updatedAt: number;

  constructor(school: School) {
    Object.assign(this, school);
  }

}
