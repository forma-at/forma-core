import moment from 'moment';
import { nanoid } from 'nanoid';
import { ExpiringCode } from '../models';
import { expiringCodeRepository } from '../repositories';

type ExpiringCodeType = typeof ExpiringCode.prototype.type;

class ExpiringCodeService {

  // Expiring code type constants
  private readonly EMAIL_VERIFICATION: ExpiringCodeType = 'EMAIL_VERIFICATION';
  private readonly FORGOT_PASSWORD: ExpiringCodeType = 'FORGOT_PASSWORD';

  // Add a new expiring code
  private async addCode(userId: string, type: ExpiringCodeType): Promise<ExpiringCode> {
    const currentCode = await expiringCodeRepository.findOne({ userId, type });
    if (!currentCode) {
      return expiringCodeRepository.create({
        userId: userId,
        type: type,
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
  private async checkCode(userId: string, code: string, type: ExpiringCodeType): Promise<boolean> {
    const currentCode = await expiringCodeRepository.findOne({ userId, type });
    if (!currentCode || currentCode.code !== code) {
      return false;
    } else {
      return moment().isBefore(currentCode.expiredAt);
    }
  }

  // Add a new 'email verification' code
  addEmailVerificationCode(userId: string) {
    return this.addCode(userId, this.EMAIL_VERIFICATION);
  }

  // Add a new 'forgot password' code
  addForgotPasswordCode(userId: string) {
    return this.addCode(userId, this.FORGOT_PASSWORD)
  }

  // Check if 'email verification' code is valid
  checkEmailVerificationCode(userId: string, code: string) {
    return this.checkCode(userId, code, this.EMAIL_VERIFICATION);
  }

  // Check if 'forgot password' code is valid
  checkForgotPasswordCode(userId: string, code: string) {
    return this.checkCode(userId, code, this.FORGOT_PASSWORD);
  }

}

export const expiringCodeService = new ExpiringCodeService();
