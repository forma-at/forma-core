import { v4 as uuid } from 'uuid';
import { teacherRepository } from '../repositories';
import { Teacher, Subject, Language, User } from '../models';
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
  async createTeacher(user: User, subjects: string[], languages: string[]) {
    const erroneousFields: Partial<Record<keyof Teacher, string>> = {};
    const subjectsError = this.validateSubjects(subjects);
    if (subjectsError) erroneousFields.subjects = subjectsError;
    const languagesError = this.validateLanguages(languages);
    if (languagesError) erroneousFields.languages = languagesError;
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return teacherRepository.create({
        id: uuid(),
        userId: user.id,
        subjects: subjects as Subject[],
        languages: languages as Language[],
      });
    }
  }

  // Update a teacher
  async updateTeacher(teacher: Teacher, subjects?: string[], languages?: string[]) {
    const erroneousFields: Partial<Record<keyof Teacher, string>> = {};
    if (subjects) {
      const subjectsError = this.validateSubjects(subjects);
      if (subjectsError) erroneousFields.subjects = subjectsError;
    }
    if (languages) {
      const languagesError = this.validateLanguages(languages);
      if (languagesError) erroneousFields.languages = languagesError;
    }
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return teacherRepository.update(
        { id: teacher.id },
        {
          subjects: subjects ? subjects as Subject[] : teacher.subjects,
          languages: languages ? languages as Language[] : teacher.languages,
        },
      );
    }
  }

  // Delete a teacher
  async deleteTeacher(teacher: Teacher) {
    return teacherRepository.deleteOne({ id: teacher.id });
  }

  // Validate an array of subjects
  validateSubjects(subjects: string[]) {
    let isValid = true;
    subjects.forEach((subject) => {
      if (!(subject in Subject)) isValid = false;
    });
    if (!isValid) return 'One or more subjects are invalid.';
  }

  // Validate an array of languages
  validateLanguages(languages: string[]) {
    let isValid = true;
    languages.forEach((language) => {
      if (!(language in Language)) isValid = false;
    });
    if (!isValid) return 'One or more languages are invalid.';
  }

}

export const teacherService = new TeacherService();
