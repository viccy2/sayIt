import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    // This merges your MongoDB User model into the Express Request
    interface User extends IUser {}
  }
}

// Fixes the "non-module entity" error for languagedetect
declare module 'languagedetect' {
  class LanguageDetect {
    constructor();
    detect(text: string, limit?: number): [string, number][];
    getLanguages(): string[];
  }
  export default LanguageDetect;
}
