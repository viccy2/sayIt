import { Request, Response, NextFunction } from 'express';

/**
 * @desc    Global Error Handling Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred',
    stack: process.env.NODE_ENV === 'production' ? '-' : err.stack,
  });
};
