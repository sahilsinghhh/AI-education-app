const ChatHistory = require('../models/ChatHistory');
const { askGemini } = require('../utils/gemini');

// @desc    Ask Gemini AI a question
// @route   POST /api/chat/ask
// @access  Private
const askQuestion = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    // Attempt to get answer from AI
    const aiResponse = await askGemini(message);

    let chatSession;
    if (sessionId) {
      chatSession = await ChatHistory.findById(sessionId);
    }
    
    if (!chatSession) {
      chatSession = await ChatHistory.create({
        user: req.user._id,
        sessionTitle: message.substring(0, 30) + '...',
        messages: []
      });
    }

    // Add user message
    chatSession.messages.push({ role: 'user', content: message });
    // Add model response
    chatSession.messages.push({ role: 'model', content: aiResponse });

    await chatSession.save();

    res.status(200).json({ sessionId: chatSession._id, reply: aiResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's chat history sessions
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific chat session
// @route   GET /api/chat/history/:id
// @access  Private
const getChatSession = async (req, res) => {
  try {
    const session = await ChatHistory.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { askQuestion, getChatHistory, getChatSession };
