const ChatHistory = require('../models/ChatHistory');
const Progress = require('../models/Progress');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { askGemini } = require('../utils/gemini');

const MAX_CONTEXT_MESSAGES = 20;

// Helper function to detect score-related queries
const isScoreQuery = (message) => {
  const scoreKeywords = [
    'score', 'marks', 'grade', 'grades', 'performance', 'how am i doing', 
    'my results', 'quiz score', 'test score', 'average', 'progress',
    'passed', 'failed', 'percentage', 'out of', 'did i get', 'my score'
  ];
  const lowerMessage = message.toLowerCase();
  return scoreKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Helper function to detect profile-related queries
const isProfileQuery = (message) => {
  const profileKeywords = [
    'profile', 'my details', 'my information', 'about me', 'who am i',
    'my account', 'my name', 'my email', 'tell me about', 'my role',
    'when did i join', 'member since', 'account details', 'user info'
  ];
  const lowerMessage = message.toLowerCase();
  return profileKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Helper function to fetch user's profile data
const getUserProfileData = async (userId) => {
  try {
    const user = await User.findById(userId);
    const totalSessions = await ChatHistory.countDocuments({ user: userId });
    const totalQuizzes = await Quiz.countDocuments({ user: userId });
    const allQuizzes = await Quiz.find({ user: userId });
    
    let totalScore = 0;
    let totalQuestions = 0;
    allQuizzes.forEach(q => {
      totalScore += q.score;
      totalQuestions += q.total;
    });
    const overallAverage = totalQuestions > 0 ? ((totalScore / totalQuestions) * 100).toFixed(2) : 0;
    
    const userCreatedDate = new Date(user.createdAt).toLocaleDateString();

    let profileContext = '\n\n[User Profile Data - provide friendly introduction based on this]\n';
    profileContext += `Name: ${user.name}\n`;
    profileContext += `Email: ${user.email}\n`;
    profileContext += `Role: ${user.role}\n`;
    profileContext += `Member Since: ${userCreatedDate}\n`;
    profileContext += `Total Chat Sessions: ${totalSessions}\n`;
    profileContext += `Total Quizzes Taken: ${totalQuizzes}\n`;
    profileContext += `Overall Average Score: ${overallAverage}%\n`;

    return profileContext;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return '';
  }
};

// Helper function to fetch user's performance data
const getUserPerformanceData = async (userId) => {
  try {
    const progress = await Progress.find({ user: userId }).populate('subject', 'name');
    const recentQuizzes = await Quiz.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('subject', 'name');

    let performanceContext = '\n\n[User Performance Data - provide insights based on this]\n';
    
    if (progress.length > 0) {
      performanceContext += '--- Progress by Subject ---\n';
      progress.forEach(p => {
        performanceContext += `• ${p.subject?.name || 'Unknown'}: Average Score: ${p.averageScore}%, Quizzes Taken: ${p.quizzesTaken}, Topics Completed: ${p.topicsCompleted.length}\n`;
      });
    }

    if (recentQuizzes.length > 0) {
      performanceContext += '\n--- Recent Quiz Results ---\n';
      recentQuizzes.forEach(q => {
        const percentage = q.total > 0 ? ((q.score / q.total) * 100).toFixed(2) : 0;
        performanceContext += `• ${q.subject?.name || q.topic}: ${q.score}/${q.total} (${percentage}%) - ${new Date(q.createdAt).toLocaleDateString()}\n`;
      });
    }

    if (progress.length === 0 && recentQuizzes.length === 0) {
      performanceContext += 'No quiz attempts yet. Start taking quizzes to see your progress!';
    }

    return performanceContext;
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return '';
  }
};

// @desc    Ask Gemini AI a question
// @route   POST /api/chat/ask
// @access  Private
const askQuestion = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
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

    // Check if user is asking about scores and fetch performance data
    let messageToSend = message;
    if (isScoreQuery(message)) {
      const performanceData = await getUserPerformanceData(req.user._id);
      messageToSend = message + performanceData;
    } else if (isProfileQuery(message)) {
      const profileData = await getUserProfileData(req.user._id);
      messageToSend = message + profileData;
    }

    // Build multi-turn context from saved history + latest user message
    const recent = (chatSession.messages || []).slice(-MAX_CONTEXT_MESSAGES);
    const aiResponse = await askGemini([
      ...recent.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: messageToSend },
    ]);

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
