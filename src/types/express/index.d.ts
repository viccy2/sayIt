import { IUser } from '../../models/user.model';

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user object populated by the 'protect' middleware.
       */
      user?: IUser;
    }
  }
}
