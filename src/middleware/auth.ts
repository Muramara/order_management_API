import { Request, Response, NextFunction } from 'express';
import { AuthUtil } from '../utils/auth';
import { ApiResponseUtil } from '../utils/response';
import { JwtPayload } from '../types';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    ApiResponseUtil.unauthorized(res, 'Access token required');
    return;
  }

  try {
    const decoded = AuthUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    ApiResponseUtil.unauthorized(res, 'Invalid or expired token');
    return;
  }
};