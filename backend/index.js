const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { generalLimiter, fileUploadLimiter, quizGenerationLimiter, authLimiter, chatLimiter } = require('./middleware/rateLimitMiddleware');

// Load API routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const chatRoutes = require('./routes/chatRoutes');
const quizRoutes = require('./routes/quizRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) return callback(null, true);

    // Allow Vercel deployments (preview + production), e.g. https://your-app.vercel.app
    try {
      const hostname = new URL(origin).hostname;
      if (hostname === 'vercel.app' || hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (_) {
      // ignore invalid origin
    }

    // Allow extra origins via env var (comma-separated)
    // Example: CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
    if (process.env.CORS_ORIGIN) {
      const allowed = process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean);
      if (allowed.includes(origin)) return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// Routes with specific rate limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/quizzes/generate', quizGenerationLimiter);
app.use('/api/quizzes/generate-from-file', fileUploadLimiter);
app.use('/api/quizzes', quizRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('StudyBuddy API is running...');
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
