import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';
import * as RequestBody from './RequestBody';
import { User } from '../models';

export interface JWTPayload {
  userId: string;
}

export interface RequestUser {
  user: User;
}

export type Request = ExpressRequest & RequestUser;
export type Response = ExpressResponse;
export type NextFunction = ExpressNextFunction;

export { RequestBody as Body };
