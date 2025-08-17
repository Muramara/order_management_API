import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponseUtil } from '../utils/response';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        ApiResponseUtil.error(res, 'Validation failed', errorMessages.join(', '), 400);
        return;
      }
      ApiResponseUtil.serverError(res, 'Validation error');
      return;
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        ApiResponseUtil.error(res, 'Query validation failed', errorMessages.join(', '), 400);
        return;
      }
      ApiResponseUtil.serverError(res, 'Query validation error');
      return;
    }
  };
};