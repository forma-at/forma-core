import { v4 as uuid } from 'uuid';
import validator from 'validator';
import moment from 'moment';
import { classRepository } from '../repositories';
import { Class, School, Language, Subject } from '../models';
import { NotFoundException, ValidationException } from '../exceptions';

class ClassService {

  // Get a class by id
  async getClassById(classId: string, preserveUndefined?: false): Promise<Class>;
  async getClassById(classId: string, preserveUndefined?: true): Promise<Class | void>;
  async getClassById(classId: string, preserveUndefined = false) {
    const classInstance = await classRepository.findOne({ id: classId });
    if (!classInstance && !preserveUndefined) {
      throw new NotFoundException('The class was not found.');
    } else {
      return classInstance;
    }
  }

  // Create a new class
  async create(
    school: School,
    subject: string,
    language: string,
    grade: string,
    start: number,
    end: number,
    description?: string,
  ) {
    const erroneousFields: Partial<Record<keyof Class, string>> = {};
    const subjectError = this.validateSubject(subject);
    if (subjectError) erroneousFields.subject = subjectError;
    const languageError = this.validateLanguage(language);
    if (languageError) erroneousFields.language = languageError;
    const gradeError = this.validateGrade(grade);
    if (gradeError) erroneousFields.grade = gradeError;
    const startError = this.validateStart(start, end);
    if (startError) erroneousFields.start = startError;
    const endError = this.validateEnd(end, start);
    if (endError) erroneousFields.end = endError;
    if (typeof description === 'string' && description !== '') {
      const descriptionError = this.validateDescription(description);
      if (descriptionError) erroneousFields.description = descriptionError;
    }
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return classRepository.create({
        id: uuid(),
        schoolId: school.id,
        teacherId: null,
        subject: subject as Subject,
        language: language as Language,
        grade,
        start,
        end,
        description: description || null,
      });
    }
  }

  // Update a class
  async update(
    classInstance: Class,
    subject?: string,
    language?: string,
    grade?: string,
    start?: number,
    end?: number,
    description?: string,
  ) {
    const erroneousFields: Partial<Record<keyof Class, string>> = {};
    if (typeof subject === 'string') {
      const subjectError = this.validateSubject(subject);
      if (subjectError) erroneousFields.subject = subjectError;
    }
    if (typeof language === 'string') {
      const languageError = this.validateLanguage(language);
      if (languageError) erroneousFields.language = languageError;
    }
    if (typeof grade === 'string') {
      const gradeError = this.validateGrade(grade);
      if (gradeError) erroneousFields.grade = gradeError;
    }
    if (typeof start === 'number') {
      const startError = this.validateStart(start, end || classInstance.end);
      if (startError) erroneousFields.start = startError;
    }
    if (typeof end === 'number') {
      const endError = this.validateEnd(end, start || classInstance.start);
      if (endError) erroneousFields.end = endError;
    }
    if (typeof description === 'string' && description !== '') {
      const descriptionError = this.validateDescription(description);
      if (descriptionError) erroneousFields.description = descriptionError;
    }
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return classRepository.update(
        { id: classInstance.id },
        {
          subject: (subject ?? classInstance.subject) as Subject,
          language: (language ?? classInstance.language) as Language,
          grade: grade ?? classInstance.grade,
          start: start ?? classInstance.start,
          end: end ?? classInstance.end,
          description: description === '' ? null : description ?? classInstance.description,
        },
      );
    }
  }

  // Delete a class
  async delete(classInstance: Class) {
    await classRepository.deleteOne({ id: classInstance.id });
  }

  // Assign a teacher to a class
  async assign(classInstance: Class, teacherId: string | null) {
    return classRepository.update({ id: classInstance.id }, { teacherId });
  }

  // Validate a class subject
  validateSubject(subject: string) {
    if (!(subject in Subject)) {
      return 'The subject is invalid.';
    }
  }

  // Validate a class language
  validateLanguage(language: string) {
    if (!(language in Language)) {
      return 'The language is invalid.';
    }
  }

  // Validate a class grade
  validateGrade(grade: string) {
    const pattern = /^[0-9]+[a-zA-Z]*$/gi;
    if (!grade.match(pattern)) {
      return 'The grade is invalid.';
    } else if (grade.length > 10) {
      return 'The grade is too long.';
    }
  }

  // Validate a class start date
  validateStart(start: number, end?: number) {
    if (!Number.isSafeInteger(start)) {
      return 'The start date is invalid.';
    } else if (end && moment(start).isAfter(end)) {
      return 'The start date cannot be after the end date.';
    }
  }

  // Validate a class end date
  validateEnd(end: number, start?: number) {
    if (!Number.isSafeInteger(end)) {
      return 'The end date is invalid.';
    } else if (start && moment(end).isBefore(start)) {
      return 'The end date cannot be before the start date.';
    }
  }

  // Validate a class description
  validateDescription(description: string) {
    if (validator.isEmpty(description)) {
      return 'The description is invalid.';
    }
  }

}

export const classService = new ClassService();
