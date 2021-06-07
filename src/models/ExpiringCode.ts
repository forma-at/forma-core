export enum ExpiringCodeType {
  emailVerification = 'email_verification',
  forgotPassword = 'forgot_password',
}

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
