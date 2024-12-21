import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

console.log('MONGO_URL:', process.env.MONGO_URL);

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URL);
    const url = `${connection.host}: ${connection.port}`
    console.log(colors.blue.bold(`MongoDBに接続しました ${url}`));
  } catch (err) {
    console.log(colors.red.bold(err.message));
    
    process.exit(1);
  }
};

export default connectDB;
