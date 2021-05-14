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
  phone?: string;
  isSchoolAdmin: boolean;
}

export interface UpdateUser {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  currentPassword: string;
}

export interface VerifyAccount {
  code: string;
}

export interface ResetPassword {
  code: string;
  password: string;
}

export interface CreateSchool {
  name: string;
  description: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
}

export interface UpdateSchool {
  name?: string;
  description?: string;
  street?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  password: string;
}
