import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.DATABASE_URL || 'mongodb://localhost:27017/sayIt',
  sessionSecret: process.env.SESSION_SECRET || 'sayit_secret_123',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: '/api/auth/google/callback',
  }
};
