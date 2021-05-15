import { v4 as uuid } from 'uuid';
import validator from 'validator';
import { schoolRepository } from '../repositories';
import { School, Address } from '../models';
import { ValidationException } from '../exceptions';

class SchoolService {

  // Get a school by id number
  async getSchoolById(schoolId: string) {
    return schoolRepository.findOne({ id: schoolId });
  }

  // Create a new school
  async createSchool(name: string, description: string, address: Address) {
    const erroneousFields: Partial<School & Address> = {};
    const nameError = this.validateField(name);
    if (nameError) erroneousFields.name = nameError;
    const descriptionError = this.validateField(description);
    if (descriptionError) erroneousFields.description = descriptionError;
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
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
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
    const erroneousFields: Partial<School & Address> = {};
    if (typeof name === 'string') {
      const nameError = this.validateField(name);
      if (nameError) erroneousFields.name = nameError;
    }
    if (typeof description === 'string') {
      const descriptionError = this.validateField(description);
      if (descriptionError) erroneousFields.description = descriptionError;
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
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
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

  // Validate a field
  validateField(field: string) {
    if (validator.isEmpty(field)) {
      return 'The field cannot be left empty.';
    }
  }

}

export const schoolService = new SchoolService();
