import { Request, Response, NextFunction } from 'express';

/**
 * @desc    Logs basic request information to the console
 */
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Wait for the response to finish to log the status code and duration
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
