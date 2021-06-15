import { v4 as uuid } from 'uuid';
import validator from 'validator';
import { schoolRepository } from '../repositories';
import { School, Address, User } from '../models';
import { NotFoundException, ValidationException } from '../exceptions';

class SchoolService {

  // Get a school by id
  async getSchoolById(schoolId: string) {
    const school = await schoolRepository.findOne({ id: schoolId });
    if (!school) {
      throw new NotFoundException('The school was not found.');
    } else {
      return school;
    }
  }

  // Get a school by user id
  async getSchoolByUserId(userId: string) {
    return schoolRepository.findOne({ userId });
  }

  // Create a new school
  async createSchool(user: User, name: string, address: Address, description?: string) {
    const erroneousFields: Partial<School & Address> = {};
    const nameError = this.validateField(name);
    if (nameError) erroneousFields.name = nameError;
    const streetError = this.validateField(address.street);
    if (streetError) erroneousFields.street = streetError;
    const cityError = this.validateField(address.city);
    if (cityError) erroneousFields.city = cityError;
    const zipError = this.validateField(address.zip);
    if (zipError) erroneousFields.zip = zipError;
    const stateError = this.validateField(address.state);
    if (stateError) erroneousFields.state = stateError;
    const countryError = this.validateField(address.country);
    if (countryError) erroneousFields.country = countryError;
    if (typeof description === 'string' && description !== '') {
      const descriptionError = this.validateField(description);
      if (descriptionError) erroneousFields.description = descriptionError;
    }
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return schoolRepository.create({
        id: uuid(),
        userId: user.id,
        name,
        address,
        description: description || null,
      });
    }
  }

  // Update a school
  async updateSchool(school: School, name?: string, address?: Address, description?: string) {
    const erroneousFields: Partial<School & Address> = {};
    if (typeof name === 'string') {
      const nameError = this.validateField(name);
      if (nameError) erroneousFields.name = nameError;
    }
    if (typeof address.street === 'string') {
      const streetError = this.validateField(address.street);
      if (streetError) erroneousFields.street = streetError;
    }
    if (typeof address.city === 'string') {
      const cityError = this.validateField(address.city);
      if (cityError) erroneousFields.city = cityError;
    }
    if (typeof address.zip === 'string') {
      const zipError = this.validateField(address.zip);
      if (zipError) erroneousFields.zip = zipError;
    }
    if (typeof address.state === 'string') {
      const stateError = this.validateField(address.state);
      if (stateError) erroneousFields.state = stateError;
    }
    if (typeof address.country === 'string') {
      const countryError = this.validateField(address.country);
      if (countryError) erroneousFields.country = countryError;
    }
    if (typeof description === 'string' && description !== '') {
      const descriptionError = this.validateField(description);
      if (descriptionError) erroneousFields.description = descriptionError;
    }
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return schoolRepository.update({ id: school.id }, {
        name: name ?? school.name,
        address: {
          street: address.street ?? school.address.street,
          city: address.city ?? school.address.city,
          zip: address.zip ?? school.address.zip,
          state: address.state ?? school.address.state,
          country: address.country ?? school.address.country,
        },
        description: description === '' ? null : description ?? school.description,
      });
    }
  }

  // Delete a school
  async deleteSchool(school: School) {
    await schoolRepository.deleteOne({ id: school.id });
  }

  // Validate a field
  validateField(field: string) {
    if (validator.isEmpty(field)) {
      return 'The field cannot be left empty.';
    }
  }

}

export const schoolService = new SchoolService();
