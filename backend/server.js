import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDatabase, shouldAutoSeedDatabase } from './utils/seeder.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/i.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const sendHealthResponse = (res) => {
  res.json({ status: 'ok', message: 'LumaCart API active', timestamp: new Date() });
};

// API Routes
app.get('/', (req, res) => {
  sendHealthResponse(res);
});

app.get('/api', (req, res) => {
  sendHealthResponse(res);
});

app.get('/health', (req, res) => {
  sendHealthResponse(res);
});

app.get('/api/health', (req, res) => {
  sendHealthResponse(res);
});

app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = Number(process.env.PORT || 5000);

export const getAvailablePort = async (preferredPort = DEFAULT_PORT, maxAttempts = 10) => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const portToCheck = preferredPort + attempt;

    const isAvailable = await new Promise((resolve) => {
      const tester = net.createServer();
      tester.once('error', () => resolve(false));
      tester.once('listening', () => {
        tester.close(() => resolve(true));
      });
      tester.listen(portToCheck, '127.0.0.1');
    });

    if (isAvailable) {
      return portToCheck;
    }
  }

  throw new Error(`No available port found starting from ${preferredPort} after ${maxAttempts} attempts.`);
};

export const startServer = async (port = DEFAULT_PORT, maxAttempts = 10) => {
  const availablePort = await getAvailablePort(port, maxAttempts);
  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.once('error', (error) => {
      reject(error);
    });

    server.listen(availablePort, () => {
      console.log(`LumaCart Server running in ${process.env.NODE_ENV || 'development'} mode on port ${availablePort}`);
      resolve();
    });
  });

  return server;
};

const initializeServer = async () => {
  await connectDB();

  if (process.env.SEED_DB === 'true') {
    await seedDatabase({ force: true });
  } else if (!isProduction) {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();

    if (shouldAutoSeedDatabase({ userCount, productCount })) {
      console.log('Fresh development database detected. Seeding demo users and catalog for local login access.');
      await seedDatabase({ force: true });
    } else {
      console.log('Database already contains demo data. Skipping automatic seeding.');
    }
  }

  await startServer();
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  initializeServer().catch((err) => {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  });
}
