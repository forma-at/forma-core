export interface Signin {
  email: string;
  password: string;
}

export interface Signup {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface VerifyAccount {
  email: string;
  code: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  email: string;
  code: string;
  password: string;
}
