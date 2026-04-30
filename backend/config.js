import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fulxerpro',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;
