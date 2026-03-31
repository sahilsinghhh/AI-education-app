const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Subject'
  },
  quizzesTaken: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  topicsCompleted: [{
    type: String
  }],
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
