import { Request } from 'express';
import { User } from '../entities/user.entity';

export interface CompleteRequest extends Request {
  user: User;
}
