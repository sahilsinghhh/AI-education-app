const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz, getQuizHistory, getQuizById } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/:id', protect, getQuizById);

module.exports = router;
