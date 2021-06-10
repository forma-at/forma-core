import { BaseRepository } from '../utils';
import { ExpiringCode } from '../models';

class ExpiringCodeRepository extends BaseRepository<ExpiringCode> {

  constructor() {
    super(ExpiringCode, 'expiring-codes');
  }

}

export const expiringCodeRepository = new ExpiringCodeRepository();
