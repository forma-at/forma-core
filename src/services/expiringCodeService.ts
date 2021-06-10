import moment from 'moment';
import { nanoid } from 'nanoid';
import { ExpiringCode, ExpiringCodeType } from '../models';
import { expiringCodeRepository } from '../repositories';

class ExpiringCodeService {

  // Add a new expiring code
  private static async addCode(userId: string, type: ExpiringCodeType): Promise<ExpiringCode> {
    const currentCode = await expiringCodeRepository.findOne({ userId, type });
    if (!currentCode) {
      return expiringCodeRepository.create({
        userId,
        type,
        code: nanoid(),
        expiredAt: moment().add(1, 'day').endOf('hours').toDate(),
      });
    } else {
      const shouldUpdateCode = moment().isAfter(moment(currentCode.updatedAt).add(5, 'minutes'));
      if (shouldUpdateCode) {
        return expiringCodeRepository.update({ userId, type }, {
          code: nanoid(),
          expiredAt: moment().add(1, 'day').endOf('hours').toDate(),
        });
      } else {
        return currentCode;
      }
    }
  }

  // Check for the validity of a code
  private static async checkCode(userId: string, code: string, type: ExpiringCodeType): Promise<boolean> {
    const currentCode = await expiringCodeRepository.findOne({ userId, type });
    if (!currentCode || currentCode.code !== code) {
      return false;
    } else {
      return moment().isBefore(currentCode.expiredAt);
    }
  }

  // Add a new 'email verification' code
  addEmailVerificationCode(userId: string) {
    return ExpiringCodeService.addCode(userId, ExpiringCodeType.emailVerification);
  }

  // Add a new 'forgot password' code
  addForgotPasswordCode(userId: string) {
    return ExpiringCodeService.addCode(userId, ExpiringCodeType.forgotPassword);
  }

  // Check if 'email verification' code is valid
  checkEmailVerificationCode(userId: string, code: string) {
    return ExpiringCodeService.checkCode(userId, code, ExpiringCodeType.emailVerification);
  }

  // Check if 'forgot password' code is valid
  checkForgotPasswordCode(userId: string, code: string) {
    return ExpiringCodeService.checkCode(userId, code, ExpiringCodeType.forgotPassword);
  }

}

export const expiringCodeService = new ExpiringCodeService();
