import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: options.message.message || 'Too many attempts. Please slow down.'
    });
  },
  message: {
    message: 'Too many requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
