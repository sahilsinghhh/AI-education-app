const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  sessionTitle: {
    type: String,
    default: 'New Chat Session'
  },
  messages: [messageSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
