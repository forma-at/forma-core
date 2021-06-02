import { v4 as uuid } from 'uuid';
import validator from 'validator';
import { teacherRepository } from '../repositories';
import { Teacher, Skill } from '../models';
import { NotFoundException, ValidationException } from '../exceptions';

class TeacherService {

  // Get a teacher by id number
  async getTeacherById(teacherId: string) {
    const teacher = teacherRepository.findOne({ id: teacherId });
    if (!teacher) {
      throw new NotFoundException('The teacher was not found.');
    } else {
      return teacher;
    }
  }

  // Create a new teacher
  async createTeacher(skills: unknown[]) {
    const erroneousFields: Partial<Record<keyof Teacher, string>> = {};
    const skillsError = this.validateSkills(skills);
    if (skillsError) erroneousFields.skills = skillsError;
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return teacherRepository.create({
        id: uuid(),
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

  // Delete a teacher by id
  async deleteTeacherById(teacherId: string) {
    return teacherRepository.delete({ id: teacherId });
  }

  // Validate a list of skills
  validateSkills(skills: unknown[]) {
    let isValid = true;
    skills.forEach((skill) => {
      if (typeof skill !== 'string' || validator.isAlphanumeric(skill)) {
        isValid = false;
      }
    });
    if (!isValid) return 'One or more skills are invalid.';
  }

}

export const teacherService = new TeacherService();
