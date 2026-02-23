import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { config } from './config/env';
import { connectDB } from './config/database';

// Import Passport Config (We'll create this file next)
import './config/passport';

// Import Routes
import authRoutes from './routes/auth.route';
import analyzeRoutes from './routes/analyze.route';
import historyRoutes from './routes/history.route';

const app: Application = express();

// 1. Connect to Database
connectDB();

// 2. Global Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: config.clientUrl, credentials: true })); // Allow Vue frontend
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// 3. Session Configuration (Required for Passport)
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// 4. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.send('sayIt API is running...');
});

// 6. Start Server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
  🚀 Server is humming at http://localhost:${PORT}
  🌍 Environment: ${config.nodeEnv}
  `);
});
