import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import mockRoutes from './routes/mockRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.set('trust proxy', 1);
connectDB();

app.use(helmet());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());

// Keep your hardcoded main production domains here
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow server-to-server or Postman requests (no origin header)
    if (!origin) return callback(null, true);

    // 2. FIX: Allow any deployment branch or preview link coming from Vercel dynamically
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Explicitly reject unauthorized domains safely without crashing the app
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
// Explicitly handle preflight requests across all routes safely
app.options('*', cors());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/mock', mockRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.get('/', (req, res) => res.json({ message: 'CodeCrack AI backend is running' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
