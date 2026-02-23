import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    // This merges our IUser model into the Express Request object
    interface User extends IUser {}
  }
}

// These declarations stop TSC from complaining about missing type definitions
declare module 'languagedetect';
declare module 'passport-google-oauth20';
declare module 'express-session';
