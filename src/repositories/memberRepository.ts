import { BaseRepository } from './baseRepository';
import { Member } from '../models';

class MemberRepository extends BaseRepository<Member> {

  constructor() {
    super(Member, 'members');
  }

}

export const memberRepository = new MemberRepository();
