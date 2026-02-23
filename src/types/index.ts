import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
// No 'declare module' needed for node-languagedetect!
