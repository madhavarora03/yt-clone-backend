import { UserDocument } from '@/interfaces';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}
