import { ObjectId } from 'mongoose';

export interface ITokenPayload {
  id: ObjectId | string;
  email: string;
  isActivated: boolean;
}
