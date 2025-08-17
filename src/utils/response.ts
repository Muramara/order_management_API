import { Response } from 'express';
import { ApiResponse } from '../types';

export class ApiResponseUtil {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    pagination?: ApiResponse['pagination']
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      ...(pagination && { pagination }),
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    error?: string,
    statusCode: number = 400
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      ...(error && { error }),
    };
    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, resource: string = 'Resource'): Response {
    return this.error(res, `${resource} not found`, undefined, 404);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, undefined, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, undefined, 403);
  }

  static serverError(res: Response, error?: string): Response {
    return this.error(res, 'Internal server error', error, 500);
  }
}