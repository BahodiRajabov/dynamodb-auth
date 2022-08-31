import { IUser } from '../../users/interface/users.interface';
import { Router, Request } from 'express';

export interface Routes {
  path?: string;
  router: Router;
}

export interface RequestWithUser extends Request {
  req: { created_at: Date; email: string; full_name: string; user_id: string; };
  user: IUser;
}