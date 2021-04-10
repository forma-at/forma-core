import { User } from '../models';
import { BaseRepository } from './baseRepository';

class UserRepository extends BaseRepository<User> {

  constructor() {
    super(User, 'users');
  }

  async getUserById(id: string) {
    return this.findOne({ id });
  }

  async getUserByEmail(email: string) {
    return this.findOne({ email });
  }

}

export const userRepository = new UserRepository();
