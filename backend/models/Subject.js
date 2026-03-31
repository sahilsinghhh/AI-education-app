const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  icon: {
    type: String,
    default: 'FaBook'
  },
  topics: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
