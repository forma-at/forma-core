import { v4 as uuid } from 'uuid';
import { schoolRepository } from '../repositories';
import { Address } from '../models';

class SchoolService {

  // Get a school by id number
  async getSchoolById(id: string) {
    return schoolRepository.findOne({ id });
  }

  // Create a new school
  async createSchool(name: string, description: string, address: Address) {
    return schoolRepository.create({
      id: uuid(),
      name,
      description,
      address,
    });
  }

}

export const schoolService = new SchoolService();
