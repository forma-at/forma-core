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
