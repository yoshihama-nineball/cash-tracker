import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('MONGO_URL:', process.env.MONGO_URL);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
