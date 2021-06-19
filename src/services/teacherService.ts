import { v4 as uuid } from 'uuid';
import validator from 'validator';
import { teacherRepository } from '../repositories';
import { Teacher, Skill, User } from '../models';
import { NotFoundException, ValidationException } from '../exceptions';

class TeacherService {

  // Get a teacher by id
  async getTeacherById(teacherId: string, preserveUndefined?: false): Promise<Teacher>;
  async getTeacherById(teacherId: string, preserveUndefined?: true): Promise<Teacher | void>;
  async getTeacherById(teacherId: string, preserveUndefined = false) {
    const teacher = await teacherRepository.findOne({ id: teacherId });
    if (!teacher && !preserveUndefined) {
      throw new NotFoundException('The teacher was not found.');
    } else {
      return teacher;
    }
  }

  // Get a teacher by user id
  async getTeacherByUserId(userId: string, preserveUndefined?: false): Promise<Teacher>;
  async getTeacherByUserId(userId: string, preserveUndefined?: true): Promise<Teacher | void>;
  async getTeacherByUserId(userId: string, preserveUndefined = false) {
    const teacher = await teacherRepository.findOne({ userId });
    if (!teacher && !preserveUndefined) {
      throw new NotFoundException('The teacher was not found.');
    } else {
      return teacher;
    }
  }

  // Get multiple teachers by ids
  async getTeachersByIds(teacherIds: string[]) {
    const teachers = await teacherRepository.findMany({ id: { $in: teacherIds } });
    return teacherIds.map((teacherId) => (
      teachers.find((teacher) => teacher.id === teacherId)
    ));
  }

  // Create a new teacher
  async createTeacher(user: User, skills: unknown[]) {
    const erroneousFields: Partial<Record<keyof Teacher, string>> = {};
    const skillsError = this.validateSkills(skills);
    if (skillsError) erroneousFields.skills = skillsError;
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return teacherRepository.create({
        id: uuid(),
        userId: user.id,
        skills: skills as Skill[],
      });
    }
  }

  // Update a teacher
  async updateTeacher(teacher: Teacher, skills?: unknown[]) {
    const erroneousFields: Partial<Record<keyof Teacher, string>> = {};
    if (skills) {
      const skillsError = this.validateSkills(skills);
      if (skillsError) erroneousFields.skills = skillsError;
    }
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return teacherRepository.update(
        { id: teacher.id },
        { skills: skills ? skills as Skill[] : teacher.skills },
      );
    }
  }

  // Delete a teacher
  async deleteTeacher(teacher: Teacher) {
    return teacherRepository.deleteOne({ id: teacher.id });
  }

  // Validate a list of skills
  validateSkills(skills: unknown[]) {
    let isValid = true;
    skills.forEach((skill) => {
      if (typeof skill !== 'string' || !validator.isAlphanumeric(skill)) {
        isValid = false;
      }
    });
    if (!isValid) return 'One or more skills are invalid.';
  }

}

export const teacherService = new TeacherService();
