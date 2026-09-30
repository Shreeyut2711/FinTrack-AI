import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<boolean> => {
  if (!ENV.MONGO_URI) {
    console.log('⚠️ MONGO_URI environment variable is not provided. Operating in hybrid memory persistent store mode for seamless immediate local execution.');
    return false;
  }

  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('✅ MongoDB Atlas connected successfully.');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    console.log('⚠️ Falling back to hybrid memory store mode for uninterrupted availability.');
    return false;
  }
};
