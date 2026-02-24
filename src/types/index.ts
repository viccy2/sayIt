import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    // Merges your MongoDB User interface into the Express Request
    interface User extends IUser {}
  }
}
