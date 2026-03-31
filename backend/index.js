const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

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
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/chat', chatRoutes);
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
