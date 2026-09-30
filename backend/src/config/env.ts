import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'fintrack_secret_jwt_key_super_secure_2026',
  JWT_EXPIRES_IN: '7d',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:5000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
