const Progress = require('../models/Progress');
const ChatHistory = require('../models/ChatHistory');
const Quiz = require('../models/Quiz');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalQuizzes = await Quiz.countDocuments({ user: userId });
    
    // Aggregate quizzes to get overall average score
    const quizzes = await Quiz.find({ user: userId });
    let totalScore = 0;
    let maxScorable = 0;
    quizzes.forEach(q => {
      totalScore += (q.score || 0);
      maxScorable += (q.total || 0);
    });
    const averageScore = maxScorable > 0 ? ((totalScore / maxScorable) * 100).toFixed(1) : 0;

    const totalChats = await ChatHistory.countDocuments({ user: userId });

    const progressBySubject = await Progress.find({ user: userId }).populate('subject', 'name icon');

    res.json({
      summary: {
        totalQuizzes,
        averageScore,
        totalChats
      },
      progressBySubject,
      recentQuizzes: quizzes.slice(-5).reverse() // Simplistic recent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
