class ExpiringCode {

  email: string;
  code: string;
  type: 'EMAIL_VERIFICATION' | 'FORGOT_PASSWORD';
  expiredAt: Date;
  createdAt: number;
  updatedAt: number;

  constructor(user: ExpiringCode) {
    Object.assign(this, user);
  }

}

export default ExpiringCode;
