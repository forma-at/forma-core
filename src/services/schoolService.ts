import { v4 as uuid } from 'uuid';
import { schoolRepository } from '../repositories';
import { School, Address } from '../models';
import { ValidationException } from '../exceptions';

class SchoolService {

  // Get a school by id number
  async getSchoolById(id: string) {
    return schoolRepository.findOne({ id });
  }

  // Create a new school
  async createSchool(name: string, description: string, address: Address) {
    if (name.length < 1) {
      throw new ValidationException('The school name cannot be left empty.');
    } else {
      return schoolRepository.create({
        id: uuid(),
        name,
        description,
        address,
      });
    }
  }

  // Update an existing school
  async updateSchool(school: School, name?: string, description?: string, address?: Address) {
    if (typeof name === 'string' && name.length < 1) {
      throw new ValidationException('The school name cannot be left empty.');
    } else {
      return schoolRepository.update({ id: school.id }, {
        name: name ?? school.name,
        description: description ?? school.description,
        address: {
          street: address.street ?? school.address.street,
          city: address.city ?? school.address.city,
          zip: address.zip ?? school.address.zip,
          state: address.state ?? school.address.state,
          country: address.street ?? school.address.country,
        },
      });
    }
  }

  // Delete an existing school by id number
  async deleteSchoolById(schoolId: string) {
    await schoolRepository.delete({ id: schoolId });
  }

}

export const schoolService = new SchoolService();
