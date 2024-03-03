import mongoose from 'mongoose';

export function isObjectId(str: string): boolean {
  return mongoose.Types.ObjectId.isValid(str);
}
