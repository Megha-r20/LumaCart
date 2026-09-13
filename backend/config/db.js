import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumacart';
    
    // Set short selection timeout for local check
    mongoose.set('strictQuery', false);

    console.log(`Connecting to MongoDB at ${connUri}...`);
    
    // Attempt standard connection first with 3s timeout
    try {
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`Local MongoDB connection failed (${err.message}). Starting MongoMemoryServer...`);
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
