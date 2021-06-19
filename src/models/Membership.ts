import { Teacher, Subject, Language } from './Teacher';
import { Address, School } from './School';
import { User } from './User';

export enum MembershipStatus {
  pending = 'pending',
  active = 'active',
  rejected = 'rejected',
}

export class Membership {
  schoolId: string;
  teacherId: string;
  status: MembershipStatus;
  createdAt: number;
  updatedAt: number;

  constructor(membership: Membership) {
    Object.assign(this, membership);
  }
}

export class MembershipWithTeacherData {
  id: string;
  status: MembershipStatus;
  subjects: Subject[];
  languages: Language[];
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  constructor(membership: Membership, teacher: Teacher, user: User) {
    this.id = membership.teacherId;
    this.status = membership.status;
    this.subjects = teacher.subjects;
    this.languages = teacher.languages;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
  }
}

export class MembershipWithSchoolData {
  id: string;
  status: MembershipStatus;
  name: string;
  address: Address;
  description?: string;
  email: string;
  phone?: string;

  constructor(membership: Membership, school: School, user: User) {
    this.id = membership.schoolId;
    this.status = membership.status;
    this.name = school.name;
    this.address = school.address;
    this.description = school.description;
    this.email = user.email;
    this.phone = user.phone;
  }
}
