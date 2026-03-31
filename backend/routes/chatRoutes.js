const express = require('express');
const router = express.Router();
const { askQuestion, getChatHistory, getChatSession } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askQuestion);
router.get('/history', protect, getChatHistory);
router.get('/history/:id', protect, getChatSession);

module.exports = router;
