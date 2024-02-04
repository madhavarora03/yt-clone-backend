import { Request } from 'express';
import { UserDocument } from '@/interfaces';

export interface AuthenticationRequest extends Request {
  user?: UserDocument;
}
