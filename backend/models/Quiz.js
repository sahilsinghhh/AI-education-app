const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String }
});

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  topic: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  score: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
