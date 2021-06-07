export enum MemberStatus {
  pending = 'pending',
  active = 'active',
  rejected = 'rejected',
}

export class Member {
  schoolId: string;
  teacherId: string;
  status: MemberStatus;
  createdAt: number;
  updatedAt: number;

  constructor(member: Member) {
    Object.assign(this, member);
  }
}
