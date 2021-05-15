import { BaseRepository } from './baseRepository';
import { User } from '../models';

class UserRepository extends BaseRepository<User> {

  constructor() {
    super(User, 'users');
  }

}

export const userRepository = new UserRepository();
