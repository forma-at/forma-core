import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { ForbiddenException } from '../exceptions';
import { User, School, USER_TYPE, Teacher } from '../models';

// Define allowed actions and valid subjects
type Actions = 'create' | 'read' | 'update' | 'delete' | 'detail' | 'preview';
type Subjects = 'User' | User | 'School' | School | 'Teacher' | Teacher;

// Define type for Ability class
export type AppAbility = Ability<[Actions, Subjects]>;
const AppAbility = Ability as AbilityClass<AppAbility>;

class AbilityService {

  // Define abilities for a user
  defineFor(user: User) {
    const { can, cannot, build } = new AbilityBuilder(AppAbility);

    // User management
    can(['read', 'update', 'delete'], 'User', { id: { $eq: user.id } });
    cannot(['read', 'update', 'delete'], 'User', { id: { $ne: user.id } })
      .because('You cannot view or manage another user.');
    cannot('create', 'User')
      .because('You cannot create new users.');

    // School management
    can('read', 'School');
    if (user.type === USER_TYPE.SCHOOL) {
      if (!user.schoolId) {
        can('create', 'School');
        cannot(['detail', 'update', 'delete'], 'School')
          .because('You cannot manage your school before you create it.');
      } else {
        can(['detail', 'update', 'delete'], 'School', { id: { $eq: user.schoolId } });
        cannot('create', 'School')
          .because('You cannot create more than one school.');
      }
      cannot(['detail', 'update', 'delete'], 'School', { id: { $ne: user.schoolId } })
        .because('You cannot manage a school you do not own.');
    } else if (user.type === USER_TYPE.TEACHER) {
      cannot(['detail', 'create', 'update', 'delete'], 'School')
        .because('You cannot manage schools with a teacher account.');
    }

    // Teacher management
    if (user.type === USER_TYPE.SCHOOL) {
      can(['read', 'update', 'delete'], 'Teacher', { schoolId: { $eq: user.schoolId } });
      cannot(['read', 'update', 'delete'], 'Teacher', { schoolId: { $ne: user.schoolId } })
        .because('You cannot manage teachers from another school.');
      cannot('create', 'Teacher')
        .because('You cannot create teachers with a school account.');
    } else if (user.type === USER_TYPE.TEACHER) {
      can('create', 'Teacher');
      can(['read', 'delete'], 'Teacher', { userId: { $eq: user.id } });
      cannot(['read', 'delete'], 'Teacher', { userId: { $ne: user.id } })
        .because('You cannot manage another teacher.');
      cannot('update', 'Teacher')
        .because('You cannot update the status of teachers with a teacher account.');
    }

    return build();

  }

  // Returns true if ability is found
  can(user: User, action: Actions, subject: Subjects) {
    return user.ability.can(action, subject);
  }

  // Returns true if ability is missing
  cannot(user: User, action: Actions, subject: Subjects) {
    return user.ability.cannot(action, subject);
  }

  // Throws ForbiddenException if ability is missing
  assureCan(user: User, action: Actions, subject: Subjects) {
    if (user.ability.cannot(action, subject)) {
      const subjectName = typeof subject === 'object' ? subject.constructor.name : String(subject);
      const defaultReason = `You cannot perform action '${action}' on subject '${subjectName}'.`;
      const reason = user.ability.relevantRuleFor(action, subject)?.reason;
      throw new ForbiddenException(reason || defaultReason);
    }
  }

}

export const abilityService = new AbilityService();
