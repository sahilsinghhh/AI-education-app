const multer = require('multer');
const path = require('path');

// Configure multer for memory storage with limits
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only specific file types
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype) ||
      file.originalname.endsWith('.txt') ||
      file.originalname.endsWith('.pdf') ||
      file.originalname.endsWith('.docx')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only TXT, PDF, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

module.exports = upload;
