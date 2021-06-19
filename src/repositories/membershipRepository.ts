import { BaseRepository } from '../utils';
import { Membership } from '../models';

class MembershipRepository extends BaseRepository<Membership> {

  constructor() {
    super(Membership, 'memberships');
  }

}

export const membershipRepository = new MembershipRepository();
