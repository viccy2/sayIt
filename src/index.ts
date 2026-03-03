import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Config & Middleware Imports
import connectDB from './config/database'; // Ensure this matches your file path
import { errorHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';

// Route Imports
import authRoutes from './routes/auth.route';
import analyzeRoutes from './routes/analyze.route';
import historyRoutes from './routes/history.route';

dotenv.config();

const app: Application = express();

/**
 * 1. Security & Logging Middleware
 */
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(logger); 

/**
 * 2. CORS Configuration
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

/**
 * 3. Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 4. Database Connection Middleware (CRITICAL FOR VERCEL)
 * This ensures the database is connected BEFORE any route logic runs.
 * It prevents the 'Buffering Timeout' error.
 */
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    console.error('💥 Database Middleware Error:', err.message);
    res.status(500).json({ 
      message: 'Database connection failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

/**
 * 5. API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

/**
 * 6. Health Check Route
 * Useful for verifying if the backend is alive on Vercel.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

/**
 * 7. Error Handling
 * This must be the last middleware.
 */
app.use(errorHandler);

/**
 * 8. Server Start (Local Development Only)
 * Vercel uses the exported 'app' and doesn't require app.listen().
 */
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Local Server active on port ${PORT}`);
  });
}

export default app;
