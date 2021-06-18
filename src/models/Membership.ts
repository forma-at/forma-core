import { Teacher, Skill } from './Teacher';
import { User } from './User';
import { Address, School } from './School';

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

export class TeacherMembershipRecord {
  id: string;
  status: MembershipStatus;
  skills: Skill[];
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  constructor(membership: Membership, teacher: Teacher, user: User) {
    this.id = membership.teacherId;
    this.status = membership.status;
    this.skills = teacher.skills;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
  }
}

export class SchoolMembershipRecord {
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
