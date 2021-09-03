import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { ForbiddenException } from '../exceptions';
import { UserWithAbility, UserType, User, School, Teacher, Membership } from '../models';

// Define allowed actions and valid subjects
type Actions = 'create' | 'read' | 'update' | 'delete';
type Subjects = 'User' | User | 'School' | School | 'Teacher' | Teacher | 'Membership' | Membership;

// Define type for Ability class
export type AppAbility = Ability<[Actions, Subjects]>;
const AppAbility = Ability as AbilityClass<AppAbility>;

class AbilityService {

  defineFor(user: User, role: { school?: School, teacher?: Teacher }) {
    const { can, cannot, build } = new AbilityBuilder(AppAbility);
    const { school, teacher } = role;

    // User management
    can(['read', 'update', 'delete'], 'User', { id: { $eq: user.id } });
    cannot(['read', 'update', 'delete'], 'User', { id: { $ne: user.id } })
      .because('You cannot manage another user.');
    cannot('create', 'User')
      .because('You cannot create new users.');

    // DEFAULT
    if (user.id !== school?.userId && user.id !== teacher?.userId) {
      if (user.type === UserType.school) {
        can('create', 'School');
        cannot(['read', 'update', 'delete'], 'School')
          .because('You cannot manage schools.');
        cannot(['create', 'read', 'update', 'delete'], 'Teacher')
          .because('You cannot manage teachers.');
      }
      if (user.type === UserType.teacher) {
        can('create', 'Teacher');
        cannot(['read', 'update', 'delete'], 'Teacher')
          .because('You cannot manage teachers.');
        cannot(['create', 'read', 'update', 'delete'], 'School')
          .because('You cannot manage schools.');
      }
      cannot(['create', 'read', 'update', 'delete'], 'Membership')
        .because('You cannot manage memberships.');
    }

    // SCHOOL
    if (user.type === UserType.school && user.id === school?.userId) {

      // School management
      can(['read', 'update', 'delete'], 'School', { id: { $eq: school.id } });
      cannot(['read', 'update', 'delete'], 'School', { id: { $ne: school.id } })
        .because('You cannot manage another school.');
      cannot('create', 'School')
        .because('You cannot create more than one school.');

      // Teacher management
      cannot(['create', 'read', 'update', 'delete'], 'Teacher')
        .because('You cannot manage teachers.');

      // Membership management
      can(['read', 'update', 'delete'], 'Membership', { schoolId: { $eq: school.id } });
      cannot(['read', 'update', 'delete'], 'Membership', { schoolId: { $ne: school.id } })
        .because('You cannot manage the memberships of another school.');
      cannot(['create'], 'Membership')
        .because('You cannot create memberships.');

    }

    // TEACHER
    if (user.type === UserType.teacher && user.id === teacher?.userId) {

      // Teacher management
      can(['read', 'update', 'delete'], 'Teacher', { id: { $eq: teacher.id } });
      cannot(['read', 'update', 'delete'], 'Teacher', { id: { $ne: teacher.id } })
        .because('You cannot manage another teacher');
      cannot('create', 'Teacher')
        .because('You cannot create more than one teacher.');

      // School management
      cannot(['create', 'read', 'update', 'delete'], 'School')
        .because('You cannot manage schools.');

      // Membership management
      can('create', 'Membership');
      can(['read', 'delete'], 'Membership', { teacherId: { $eq: teacher.id } });
      cannot(['read', 'delete'], 'Membership', { teacherId: { $ne: teacher.id } })
        .because('You cannot manage the memberships of another teacher.');
      cannot('update', 'Membership')
        .because('You cannot update memberships.');

    }

    return build();
  }

  // Throws ForbiddenException if ability is missing
  assureCan(user: UserWithAbility, action: Actions, subject: Subjects) {
    if (user.ability.cannot(action, subject)) {
      const subjectName = typeof subject === 'object' ? subject.constructor.name : String(subject);
      const defaultReason = `You cannot perform action '${action}' on subject '${subjectName}'.`;
      const reason = user.ability.relevantRuleFor(action, subject)?.reason;
      throw new ForbiddenException(reason || defaultReason);
    }
  }

}

export const abilityService = new AbilityService();
