import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories';
import { ValidationException } from '../exceptions';
import { User } from '../models';

class UserService {

  // Create a JsonWebToken for a user
  async createJWT(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      const payload = { id: user.id };
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
  async signup(email: string, firstName: string, lastName: string, password: string): Promise<User> {
    const emailInUse = await userRepository.getUserByEmail(email);
    if (emailInUse) {
      throw new ValidationException('EmailAddressInUse');
    } else {
      const passwordHashed = await bcrypt.hash(password, 10);
      return userRepository.create({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: passwordHashed,
        emailConfirmed: false,
      });
    }
  }

  // Check if account exists with email and password
  async signin(email: string, password: string) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new ValidationException('InvalidEmailOrPassword');
    } else {
      const doPasswordsMatch = await bcrypt.compare(password, user.password);
      if (!doPasswordsMatch) {
        throw new ValidationException('InvalidEmailOrPassword');
      } else {
        return user;
      }
    }
  }

}

export const userService = new UserService();
