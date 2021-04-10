import { User } from '../models';
import { BaseRepository } from './baseRepository';

class UserRepository extends BaseRepository<User> {

  // UserRepository constructor
  constructor() {
    super(User, 'users');
  }

  // Find user by id
  async getUserById(id: string) {
    return this.findOne({ id });
  }

  // Find user by email address
  async getUserByEmail(email: string) {
    return this.findOne({ email });
  }

}

export const userRepository = new UserRepository();
