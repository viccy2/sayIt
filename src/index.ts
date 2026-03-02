import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from './routes/auth.route';
import analyzeRoutes from './routes/analyze.route';
import historyRoutes from './routes/history.route';

// Middleware Imports
import { errorHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';

dotenv.config();

const app: Application = express();

// 1. Security & Logging Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(logger); // Your custom logger middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

/**
 * 3. Passport & Session (DEACTIVATED FOR NOW)
 * We are commenting these out to stop the build errors related to missing 
 * Google Strategy dependencies. We will use JWT for the Email/Password flow.
 */
// import passport from 'passport';
// import './config/passport';
// app.use(passport.initialize());
// app.use(passport.session());

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

// 5. Global Error Handler
app.use(errorHandler);

// 6. Database & Server Startup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

export default app;
