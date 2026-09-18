import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const connUri = process.env.MONGODB_URI || (isProduction ? null : 'mongodb://127.0.0.1:27017/lumacart');

  if (!connUri && isProduction) {
    throw new Error('Missing MONGODB_URI environment variable. Set it in your Render environment before starting the production server.');
  }

  mongoose.set('strictQuery', false);

  console.log(`Connecting to MongoDB at ${connUri ? connUri.replace(/\/\/.*@/, '//***:***@') : 'development default'}...`);

  try {
    const conn = await mongoose.connect(connUri || 'mongodb://127.0.0.1:27017/lumacart', {
      serverSelectionTimeoutMS: isProduction ? 10000 : 5000,
      retryWrites: true,
      autoIndex: !isProduction,
      maxPoolSize: 10
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (isProduction) {
      console.error(`Production MongoDB connection failed: ${error.message}`);
      throw error;
    }

    console.warn(`Local MongoDB connection failed (${error.message}). Starting MongoMemoryServer...`);
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    return conn;
  }
};
