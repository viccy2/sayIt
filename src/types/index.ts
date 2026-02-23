import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// The "Brute Force" fix to stop the 'non-module entity' error
// This simply tells TS: "languagedetect exists, don't worry about its shape"
declare module 'languagedetect';
