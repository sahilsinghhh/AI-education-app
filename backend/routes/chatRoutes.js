const express = require('express');
const router = express.Router();
const { askQuestion, getChatHistory, getChatSession } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/ask', protect, chatLimiter, askQuestion);
router.get('/history', protect, getChatHistory);
router.get('/history/:id', protect, getChatSession);

module.exports = router;
