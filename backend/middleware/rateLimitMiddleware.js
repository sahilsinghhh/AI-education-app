const rateLimit = require('express-rate-limit');

// General rate limit: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for file uploads: 10 per hour per user
const fileUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many file uploads, try again in an hour',
  skip: (req) => !req.user,
  keyGenerator: (req) => req.user?._id || req.ip,
});

// Strict limit for AI quiz generation: 20 per hour per user
const quizGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Too many quiz generations, try again later',
  skip: (req) => !req.user,
  keyGenerator: (req) => req.user?._id || req.ip,
});

// Auth routes: 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, try again later',
  skipSuccessfulRequests: true,
});

// Chat limiter: 30 messages per hour per user
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: 'Too many chat messages, try again later',
  skip: (req) => !req.user,
  keyGenerator: (req) => req.user?._id || req.ip,
});

module.exports = {
  generalLimiter,
  fileUploadLimiter,
  quizGenerationLimiter,
  authLimiter,
  chatLimiter
};
