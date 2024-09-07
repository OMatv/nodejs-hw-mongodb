import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const mongoUrl = env('MONGODB_URL');
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error', error.message);
    process.exit(1);
  }
};
