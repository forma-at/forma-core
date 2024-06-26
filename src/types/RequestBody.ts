export interface Authenticate {
  email: string;
  password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  userId: string;
  code: string;
  password: string;
}

export interface CreateUser {
  type: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  password: string;
  language: string;
}

export interface DeleteUser {
  currentPassword: string;
}

export interface VerifyUser {
  code: string;
}

export interface UpdateProfile {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  currentPassword: string;
}

export interface UpdateLanguage {
  language: string;
}

export interface CreateSchool {
  name: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  description?: string;
}

export interface UpdateSchool {
  name?: string;
  street?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  description?: string;
}

export interface CreateTeacher {
  subjects: string[];
  languages: string[];
}

export interface UpdateTeacher {
  subjects?: string[];
  languages?: string[];
}

export interface UpdateMembership {
  status: string;
}

export interface CreateClass {
  subject: string;
  language: string;
  group: string;
  start: number;
  end: number;
  description?: string;
}

export interface UpdateClass {
  subject?: string;
  language?: string;
  group?: string;
  start?: number;
  end?: number;
  description?: string;
}
