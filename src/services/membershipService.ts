import { membershipRepository } from '../repositories';
import {
  Membership,
  MembershipStatus,
  School,
  SchoolMembershipRecord,
  Teacher,
  TeacherMembershipRecord,
} from '../models';
import { NotFoundException, ValidationException } from '../exceptions';
import { userService } from './userService';
import { teacherService } from './teacherService';
import { schoolService } from './schoolService';

class MembershipService {

  // Get a membrship by school id and teacher id
  async getOne(schoolId: string, teacherId: string, preserveUndefined?: false): Promise<Membership>;
  async getOne(schoolId: string, teacherId: string, preserveUndefined?: true): Promise<Membership | void>;
  async getOne(schoolId: string, teacherId: string, preserveUndefined = false) {
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

  // Get teacher membership records by school
  async getTeacherRecordsBySchool(school: School) {
    const memberships = await membershipRepository.findMany({ schoolId: school.id });
    const teacherIds = memberships.map((membership) => membership.teacherId);
    const teachers = await teacherService.getTeachersByIds(teacherIds);
    const userIds = teachers.map((teacher) => teacher.userId);
    const users = await userService.getUsersByIds(userIds);
    return memberships.map((membership, index) => {
      return new TeacherMembershipRecord(membership, teachers[index], users[index]);
    });
  }

  // Get school membership records by teacher
  async getSchoolRecordsByTeacher(teacher: Teacher) {
    const memberships = await membershipRepository.findMany({ teacherId: teacher.id });
    const schoolIds = memberships.map((membership) => membership.schoolId);
    const schools = await schoolService.getSchoolsByIds(schoolIds);
    const userIds = schools.map((school) => school.userId);
    const users = await userService.getUsersByIds(userIds);
    return memberships.map((membership, index) => {
      return new SchoolMembershipRecord(membership, schools[index], users[index]);
    });
  }

  // Validate membership status
  validateStatus(status: string) {
    if (!(status in MembershipStatus)) {
      return 'The membership status is invalid.';
    }
  }

}

export const membershipService = new MembershipService();
