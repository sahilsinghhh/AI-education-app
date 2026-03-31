const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const { askGemini } = require('../utils/gemini');

// @desc    Generate a new quiz
// @route   POST /api/quizzes/generate
// @access  Private
const generateQuiz = async (req, res) => {
  try {
    const { topic, subjectId } = req.body;
    
    const prompt = `Generate a 5-question multiple choice quiz about "${topic}".
Output MUST be strictly valid JSON array of objects.
Each object must have:
- "question": the question text
- "options": an array of 4 string choices
- "correctAnswer": the exact string of the correct choice
- "explanation": a short string explaining why the answer is correct
No markdown wrapping, no extra text, just the JSON array.`;

    const aiResponse = await askGemini(prompt);
    
    // Parse response
    let questions;
    try {
      // Remove any potential markdown wrappers
      const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      questions = JSON.parse(cleanJson);
    } catch (e) {
      console.error("AI response parsing error:", aiResponse);
      return res.status(500).json({ message: 'Failed to generate valid quiz format from AI.' });
    }

    const quiz = await Quiz.create({
      user: req.user._id,
      subject: subjectId || null,
      topic,
      questions,
      score: 0,
      total: questions.length
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { score } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    quiz.score = score;
    await quiz.save();

    // Update Progress
    if (quiz.subject) {
      let progress = await Progress.findOne({ user: req.user._id, subject: quiz.subject });
      if (!progress) {
        progress = new Progress({ user: req.user._id, subject: quiz.subject });
      }
      
      const prevTotalScore = progress.quizzesTaken * progress.averageScore;
      progress.quizzesTaken += 1;
      progress.averageScore = (prevTotalScore + score) / progress.quizzesTaken;
      progress.lastActive = Date.now();
      
      if (!progress.topicsCompleted.includes(quiz.topic) && score >= (quiz.total / 2)) {
        progress.topicsCompleted.push(quiz.topic);
      }
      
      await progress.save();
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's quiz history
// @route   GET /api/quizzes/history
// @access  Private
const getQuizHistory = async (req, res) => {
  try {
    const history = await Quiz.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('subject', 'name icon');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('subject', 'name icon');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    if (quiz.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuiz, submitQuiz, getQuizHistory, getQuizById };
