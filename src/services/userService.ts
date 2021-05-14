import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { JWTPayload } from 'Router';
import { userRepository } from '../repositories';
import { ValidationException } from '../exceptions';
import { User, School } from '../models';

class UserService {

  // Password policy object
  private readonly PASSWORD_POLICY: validator.strongPasswordOptions = {
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 0,
  };

  // Get a user by id number
  async getUserById(id: string) {
    return userRepository.getUserById(id);
  }

  // Get a user by email address
  async getUserByEmail(email: string) {
    return userRepository.getUserByEmail(email);
  }

  // Create a JsonWebToken for a user
  async createJWT(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      const payload: JWTPayload = { userId: user.id };
      const secret = process.env.JWT_SECRET;
      jwt.sign(payload, secret, (err: Error, token: string) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(token);
        }
      });
    });
  }

  // Create a new user account
  async createAccount(email: string, firstName: string, lastName: string, password: string, isSchoolAdmin: boolean, language: string, phone?: string) {
    const erroneousFields: Partial<User> = {};
    const emailError = await this.validateEmailAddress(email);
    if (emailError) erroneousFields.email = emailError;
    const phoneError = this.validateMobilePhone(phone);
    if (phoneError) erroneousFields.phone = phoneError;
    const firstNameError = this.validateName(firstName);
    if (firstNameError) erroneousFields.firstName = firstNameError;
    const lastNameError = this.validateName(lastName);
    if (lastNameError) erroneousFields.lastName = lastNameError;
    const passwordError = this.validatePassword(password);
    if (passwordError) erroneousFields.password = passwordError;
    const languageError = this.validateLanguageCode(language);
    if (languageError) erroneousFields.language = languageError;
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      const passwordHashed = await bcrypt.hash(password, 10);
      return userRepository.create({
        id: uuid(),
        type: isSchoolAdmin ? 'school' : 'teacher',
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        password: passwordHashed,
        emailConfirmed: false,
        language: language,
      });
    }
  }

  // Verify a user account with email address
  async verifyAccount(user: User) {
    if (!user.emailConfirmed) {
      return userRepository.update({ id: user.id }, {
        emailConfirmed: true,
      });
    } else {
      return user;
    }
  }

  // Compare the password of a user to the input
  async comparePasswords(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }

  // Change the password of a user
  async changePassword(user: User, password: string) {
    const passwordError = this.validatePassword(password);
    if (passwordError) {
      throw new ValidationException(passwordError);
    } else {
      const passwordHashed = await bcrypt.hash(password, 10);
      return userRepository.update({ id: user.id }, {
        password: passwordHashed,
      });
    }
  }

  // Assign a school to a user
  async assignSchool(user: User, school: School) {
    return userRepository.update({ id: user.id }, {
      schoolId: school.id,
    });
  }

  // Update a user's profile data
  async updateProfile(user: User, password: string, data: Partial<User>) {
    const erroneousFields: Partial<User & { currentPassword: string }> = {};
    const isPasswordCorrect = await this.comparePasswords(user, password);
    if (!isPasswordCorrect) {
      erroneousFields.currentPassword = 'The password is incorrect.';
    }
    if (typeof data.email === 'string' && data.email !== user.email) {
      const emailError = await this.validateEmailAddress(data.email);
      if (emailError) erroneousFields.email = emailError;
    }
    if (typeof data.phone === 'string' && data.phone !== '') {
      const phoneError = this.validateMobilePhone(data.phone)
      if (phoneError) erroneousFields.phone = phoneError;
    }
    if (typeof data.firstName === 'string') {
      const firstNameError = this.validateName(data.firstName);
      if (firstNameError) erroneousFields.firstName = firstNameError;
    }
    if (typeof data.lastName === 'string') {
      const lastNameError = this.validateName(data.lastName);
      if (lastNameError) erroneousFields.lastName = lastNameError;
    }
    if (typeof data.password === 'string') {
      const passwordError = this.validatePassword(data.password);
      if (passwordError) erroneousFields.password = passwordError;
      if (!passwordError) data.password = await bcrypt.hash(data.password, 10);
    }
    if (Object.keys(erroneousFields).length) {
      throw new ValidationException('The provided data is invalid.', erroneousFields);
    } else {
      return userRepository.update({ id: user.id }, {
        email: data.email ?? user.email,
        phone: data.phone ?? user.phone,
        firstName: data.firstName ?? user.firstName,
        lastName: data.lastName ?? user.lastName,
        password: data.password ?? user.password,
      });
    }
  }

  // Update the user's preferred language
  async updateLanguage(user: User, language: string) {
    const languageError = this.validateLanguageCode(language);
    if (languageError) {
      throw new ValidationException(languageError);
    } else {
      return userRepository.update({ id: user.id }, {
        language: language.trim().toLowerCase(),
      });
    }
  }

  // Validate an email address, including checking for usage
  async validateEmailAddress(email: string) {
    const emailInUse = await this.getUserByEmail(email);
    if (emailInUse) {
      return 'This email address is already in use.';
    } else if (!validator.isEmail(email)) {
      return 'The email address is invalid.';
    }
  }

  // Validate a mobile phone number
  validateMobilePhone(phone: string) {
    if (!validator.isMobilePhone(phone, 'any', { strictMode: true })) {
      return 'The mobile phone number is invalid.';
    }
  }

  // Validate a password using the password policy
  validatePassword(password: string) {
    if (!validator.isStrongPassword(password, this.PASSWORD_POLICY)) {
      return 'The password is too weak.';
    }
  }

  // Validate a name
  validateName(name: string) {
    if (validator.isEmpty(name)) {
      return 'The name cannot be empty.';
    }
  }

  // Validate a language code
  validateLanguageCode(language: string) {
    if (!validator.isLocale(language)) {
      return 'The language code is invalid.';
    }
  }

}

export const userService = new UserService();
