import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { JWTPayload } from 'Router';
import { userRepository } from '../repositories';
import { ValidationException } from '../exceptions';
import { User } from '../models';

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
  async createAccount(email: string, firstName: string, lastName: string, password: string, isSchoolAdmin: boolean, phone?: string) {
    const emailInUse = await userRepository.getUserByEmail(email);
    if (emailInUse) {
      throw new ValidationException('This email address is already in use.');
    } else if (!validator.isEmail(email)) {
      throw new ValidationException('The email address is invalid.')
    } else if (!validator.isStrongPassword(password, this.PASSWORD_POLICY)) {
      throw new ValidationException('The password is too weak.');
    } else {
      const passwordHashed = await bcrypt.hash(password, 10);
      return userRepository.create({
        id: uuid(),
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        password: passwordHashed,
        emailConfirmed: false,
        isSchoolAdmin: isSchoolAdmin,
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
    if (!validator.isStrongPassword(password, this.PASSWORD_POLICY)) {
      throw new ValidationException('The password is too weak.');
    } else {
      const passwordHashed = await bcrypt.hash(password, 10);
      return userRepository.update({ id: user.id }, {
        password: passwordHashed,
      });
    }
  }

}

export const userService = new UserService();
