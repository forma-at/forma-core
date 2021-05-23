import { teacherRepository } from '../repositories';
import { userService } from './userService';
import { Teacher, TeacherStatus, TEACHER_STATUS } from '../models';
import { ValidationException } from '../exceptions';

class TeacherService {

  // Get all teachers by school id
  async getTeachersBySchoolId(schoolId: string): Promise<Teacher[]> {
    const teachers = await teacherRepository.findMany({ schoolId });
    const users = await userService.getUsersByIds(teachers.map((teacher) => teacher.userId));
    return teachers.map((teacher) => {
      const userDetails = users.find((user) => user.id === teacher.userId);
      return {
        ...teacher,
        details: userDetails ? userService.sanitizeUser(userDetails) : null,
      };
    });
  }

  // Get one teacher by user id
  async getTeacherByUserId(userId: string): Promise<Teacher | void> {
    const teacher = await teacherRepository.findOne({ userId });
    if (teacher) {
      const user = await userService.getUserById(teacher.userId);
      return {
        ...teacher,
        details: user ? userService.sanitizeUser(user) : null,
      };
    }
  }

  // Create a school teacher
  async createTeacher(userId: string, schoolId: string) {
    return teacherRepository.create({
      userId,
      schoolId,
      status: TEACHER_STATUS.PENDING,
    });
  }

  // Update the status of a school teacher
  async updateTeacherStatus(userId: string, status: string) {
    if (!(status in TEACHER_STATUS)) {
      throw new ValidationException('The provided status was invalid.');
    } else {
      return teacherRepository.update(
        { userId },
        { status: status as TeacherStatus },
      );
    }
  }

  // Delete a school teacher
  async deleteTeacher(userId: string) {
    return teacherRepository.delete({ userId });
  }

}

export const teacherService = new TeacherService();
