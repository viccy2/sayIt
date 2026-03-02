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

/**
 * 1. Global Middleware
 * Logger and Security headers should always come first.
 */
app.use(logger); // Your custom request logger
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Development logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 2. CORS Configuration
 * Ensures your Vue 3 frontend can talk to this API.
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

/**
 * 3. Passport & Session (DEACTIVATED)
 * Commented out to prevent build errors while Google Console issues are resolved.
 * We are using JWT-based auth in auth.route.ts instead.
 */
// import passport from 'passport';
// import './config/passport';
// app.use(passport.initialize());
// app.use(passport.session());

/**
 * 4. API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

/**
 * 5. Error Handling
 * This MUST be the last middleware in the stack.
 */
app.use(errorHandler);

/**
 * 6. Database Connection & Server Start
 */
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✨ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('💥 Database connection failed:', err.message);
  });

export default app;
