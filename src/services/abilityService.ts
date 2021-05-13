import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { ForbiddenException } from '../exceptions';
import { User, School } from '../models';

// Define allowed actions and valid subjects
type Actions = 'create' | 'read' | 'update' | 'delete';
type Subjects = 'User' | User | 'School' | School;

// Define type for Ability class
export type AppAbility = Ability<[Actions, Subjects]>;
const AppAbility = Ability as AbilityClass<AppAbility>;

class AbilityService {

  // Define abilities for a user
  defineFor(user: User) {
    const { can, cannot, build } = new AbilityBuilder(AppAbility);

    // School management
    can('read', 'School');
    if (user.type === 'school') {
      if (!user.schoolId) {
        can('create', 'School');
        cannot(['update', 'delete'], 'School')
          .because('Managing a non-existent school is not allowed.');
      } else {
        can(['update', 'delete'], 'School', { id: { $eq: user.schoolId } });
        cannot('create', 'School')
          .because('Creating more than one school is not allowed.');
      }
      cannot(['create', 'update', 'delete'], 'School', { id: { $ne: user.schoolId } })
        .because('Managing another school is not allowed.');
    } else {
      cannot(['create', 'update', 'delete'], 'School')
        .because('Managing schools with a teacher account is not allowed.');
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
  assure(user: User, can: Actions, subject: Subjects) {
    if (user.ability.cannot(can, subject)) {
      const defaultReason = `Action '${can}' on subject '${subject}' is forbidden.`;
      const reason = user.ability.relevantRuleFor(can, subject)?.reason;
      throw new ForbiddenException(reason || defaultReason);
    }
  }

}

export const abilityService = new AbilityService();