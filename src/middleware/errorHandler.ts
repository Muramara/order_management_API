import { Request, Response, NextFunction } from 'express';
import { ApiResponseUtil } from '../utils/response';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    if (prismaError.code === 'P2002') {
      ApiResponseUtil.error(res, 'Unique constraint violation', 'Resource already exists', 409);
      return;
    }
    
    if (prismaError.code === 'P2025') {
      ApiResponseUtil.notFound(res, 'Resource');
      return;
    }
  }

  // Default error
  ApiResponseUtil.serverError(res, process.env.NODE_ENV === 'development' ? error.message : undefined);
};