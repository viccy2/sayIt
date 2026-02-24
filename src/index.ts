import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/database';
import authRoutes from './routes/auth.route';
// ... other imports

const app = express();

// 1. Database Connection
connectDB();

// 2. CORS - Allow your Vercel Frontend
app.use(cors({
  origin: process.env.CLIENT_URL, // e.g. https://sayit-frontend.vercel.app
  credentials: true
}));

app.use(express.json());

// 3. Session & Cookies (Vercel Production Settings)
app.set('trust proxy', 1); // Trust Vercel's proxy for secure cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 4. Routes
app.use('/api/auth', authRoutes);
// app.use('/api/analyze', analyzeRoutes);

// 5. Port Listening (ONLY in development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Running locally on port ${PORT}`));
}

// 6. Export for Vercel
export default app;
