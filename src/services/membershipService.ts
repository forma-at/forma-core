import { membershipRepository } from '../repositories';
import { Membership, MembershipStatus } from '../models';
import { NotFoundException, ValidationException } from '../exceptions';

class MembershipService {

  // Get a membership by school id
  async getMembershipsBySchoolId(schoolId: string) {
    return membershipRepository.findMany({ schoolId });
  }

  // Get a membrship by school id and teacher id
  async getBySchooldIdAndTeacherId(schoolId: string, teacherId: string, preserveUndefined?: false): Promise<Membership>;
  async getBySchooldIdAndTeacherId(schoolId: string, teacherId: string, preserveUndefined?: true): Promise<Membership | void>;
  async getBySchooldIdAndTeacherId(schoolId: string, teacherId: string, preserveUndefined = false) {
    const membership = await membershipRepository.findOne({ schoolId, teacherId });
    if (!membership && !preserveUndefined) {
      throw new NotFoundException('The membership was not found.');
    } else {
      return membership;
    }
  }

  // Create a new membership
  async create(schoolId: string, teacherId: string) {
    const exists = await membershipRepository.findOne({ schoolId, teacherId });
    if (!exists) {
      return membershipRepository.create({
        schoolId,
        teacherId,
        status: MembershipStatus.pending,
      });
    } else {
      return exists;
    }
  }

  // Update a membership
  async update(membership: Membership, status: string) {
    const statusError = this.validateStatus(status);
    if (statusError) {
      throw new ValidationException(statusError);
    } else {
      return membershipRepository.update({
        schoolId: membership.schoolId,
        teacherId: membership.teacherId,
      }, {
        status: status as MembershipStatus,
      });
    }
  }

  // Delete a membership
  async delete(membership: Membership) {
    return membershipRepository.deleteOne({
      schoolId: membership.schoolId,
      teacherId: membership.teacherId,
    });
  }

  // Delete memberships by school id
  async deleteBySchoolId(schoolId: string) {
    return membershipRepository.deleteMany({ schoolId });
  }

  // Delete memberships by teacher id
  async deleteByTeacherId(teacherId: string) {
    return membershipRepository.deleteMany({ teacherId });
  }

  // Validate membership status
  validateStatus(status: string) {
    if (!(status in MembershipStatus)) {
      return 'The membership status is invalid.';
    }
  }

}

export const membershipService = new MembershipService();
