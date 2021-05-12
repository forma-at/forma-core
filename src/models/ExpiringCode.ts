export type ExpiringCodeType = 'EMAIL_VERIFICATION' | 'FORGOT_PASSWORD';

export class ExpiringCode {

  userId: string;
  code: string;
  type: ExpiringCodeType;
  expiredAt: Date;
  createdAt: number;
  updatedAt: number;

  constructor(user: ExpiringCode) {
    Object.assign(this, user);
  }

}
