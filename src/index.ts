import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Config & Middleware Imports
import connectDB from './config/database'; 
import { errorHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';

// Route Imports
import authRoutes from './routes/auth.route';
import analyzeRoutes from './routes/analyze.route';
import historyRoutes from './routes/history.route';

dotenv.config();

const app: Application = express();

/**
 * Security & Logging Middleware
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); 
app.use(morgan('dev')); 
app.use(logger); 

/**
 * CORS Configuration
 * Hardcoded production URL for reliability, plus environment flexibility.
 */
const allowedOrigins = [
  'https://say-it-frontend.vercel.app',    // Primary production frontend
  'http://localhost:5173',            // Vite local development
  process.env.FRONTEND_URL            // Dynamic ENV URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    // Normalize origin by removing trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, "");
      return normalizedOrigin === normalizedAllowed;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(` CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicitly handle Preflight (OPTIONS) requests
app.options('*', cors());

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Database Connection Middleware
 */
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    console.error(' Database Connection Error:', err.message);
    res.status(500).json({ 
      message: 'Database connection failed.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

/**
 * Health Check Route
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

/**
 * Error Handling
 */
app.use(errorHandler);

/**
 * Server Start
 */
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
