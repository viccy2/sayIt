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
 * 1. Security & Logging Middleware
 * Modified Helmet to allow Cross-Origin requests from your frontend
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); 
app.use(morgan('dev')); 
app.use(logger); 

/**
 * 2. Optimized CORS Configuration
 * This version explicitly handles the Vercel production URL and local dev.
 */
const allowedOrigins = [
  'https://say-it-frontend.vercel.app',  // Your production frontend
  'http://localhost:5173',          // Local development
  process.env.FRONTEND_URL          // From your Environment Variables
].filter(Boolean) as string[];      // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    const isAllowed = allowedOrigins.some(allowed => 
      origin === allowed || origin === `${allowed}/`
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`❌ CORS Blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicitly handle Preflight requests
app.options('*', cors());

/**
 * 3. Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 4. Database Connection Middleware
 */
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    console.error('💥 Database Middleware Error:', err.message);
    res.status(500).json({ 
      message: 'Database connection failed.',
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
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * 7. Error Handling
 */
app.use(errorHandler);

/**
 * 8. Server Start
 */
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Local Server active on port ${PORT}`);
  });
}

export default app;
