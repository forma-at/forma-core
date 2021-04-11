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
  private async addCode(email: string, type: ExpiringCodeType): Promise<ExpiringCode> {
    const currentCode = await expiringCodeRepository.findOne({ email, type });
    if (!currentCode) {
      return expiringCodeRepository.create({
        email: email,
        type: type,
        code: nanoid(),
        expiredAt: moment().add(1, 'day').endOf('hours').toDate(),
      });
    } else {
      const shouldUpdateCode = moment().isAfter(moment(currentCode.updatedAt).add(5, 'minutes'));
      if (shouldUpdateCode) {
        return expiringCodeRepository.update({ email, type }, {
          code: nanoid(),
          expiredAt: moment().add(1, 'day').endOf('hours').toDate(),
        })
      } else {
        return currentCode;
      }
    }
  }

  // Check for the validity of a code
  private async checkCode(email: string, code: string, type: ExpiringCodeType): Promise<boolean> {
    const currentCode = await expiringCodeRepository.findOne({ email, type });
    if (!currentCode || currentCode.code !== code) {
      return false;
    } else {
      return moment().isBefore(currentCode.expiredAt);
    }
  }

  // Add a new 'email verification' code
  addEmailVerificationCode(email: string) {
    return this.addCode(email, this.EMAIL_VERIFICATION);
  }

  // Add a new 'forgot password' code
  addForgotPasswordCode(email: string) {
    return this.addCode(email, this.FORGOT_PASSWORD)
  }

  // Check if 'email verification' code is valid
  checkEmailVerificationCode(email: string, code: string) {
    return this.checkCode(email, code, this.EMAIL_VERIFICATION);
  }

  // Check if 'forgot password' code is valid
  checkForgotPasswordCode(email: string, code: string) {
    return this.checkCode(email, code, this.FORGOT_PASSWORD);
  }

}

export const expiringCodeService = new ExpiringCodeService();
