import { BaseRepository } from './baseRepository';
import { ExpiringCode } from '../models';

class ExpiringCodeRepository extends BaseRepository<ExpiringCode> {

  constructor() {
    super(ExpiringCode, 'expiringCodes');
  }

}

export const expiringCodeRepository = new ExpiringCodeRepository();
