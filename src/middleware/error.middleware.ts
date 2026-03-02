import { Request, Response, NextFunction } from 'express';

/**
 * @desc    Global Error Handling Middleware
 * @notice  In Express, error middleware must have 4 arguments (err, req, res, next)
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set status code: If the error already has a status, use it; otherwise, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the error for you to see in Vercel/Terminal
  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred',
    // Only show the stack trace if we are NOT in production
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
