import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// Ensure libraries without @types don't break the build
declare module 'languagedetect';
