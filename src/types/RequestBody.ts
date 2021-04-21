export interface Authenticate {
  email: string;
  password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface CreateAccount {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface VerifyAccount {
  code: string;
}

export interface ResetPassword {
  code: string;
  password: string;
}
