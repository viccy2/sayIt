import './types/index'; // MUST BE FIRST
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { config } from './config/env';
import { connectDB } from './config/database';

// Config & Routes
import './config/passport';
import authRoutes from './routes/auth.route';
import analyzeRoutes from './routes/analyze.route';
import historyRoutes from './routes/history.route';

const app: Application = express();

connectDB();

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.nodeEnv === 'production' },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('sayIt API is running...');
});

const PORT = config.port;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
