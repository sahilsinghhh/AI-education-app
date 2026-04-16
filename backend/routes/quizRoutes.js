const express = require('express');
const router = express.Router();
const { generateQuiz, generateQuizFromFile, submitQuiz, getQuizHistory, getQuizById } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const { quizGenerationLimiter, fileUploadLimiter } = require('../middleware/rateLimitMiddleware');

// Timeout middleware for file upload routes
const fileUploadTimeout = (req, res, next) => {
  // Set 5 minute timeout for file uploads
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000);
  next();
};

router.post('/generate', protect, quizGenerationLimiter, generateQuiz);
router.post('/generate-from-file', protect, fileUploadTimeout, fileUploadLimiter, upload.single('file'), generateQuizFromFile);
router.post('/:id/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/:id', protect, getQuizById);

module.exports = router;
