import { BaseRepository } from '../utils';
import { Member } from '../models';

class MemberRepository extends BaseRepository<Member> {

  constructor() {
    super(Member, 'members');
  }

}

export const memberRepository = new MemberRepository();
