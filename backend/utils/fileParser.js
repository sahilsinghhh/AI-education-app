const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const { Readable } = require('stream');

/**
 * Extract text content from uploaded files (TXT, PDF, DOCX)
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} mimetype - The MIME type of the file
 * @param {string} originalname - Original filename
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromFile = async (fileBuffer, mimetype, originalname) => {
  try {
    // Handle TXT files
    if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
      return fileBuffer.toString('utf-8');
    }

    // Handle PDF files with streaming
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      // Create a readable stream from buffer
      const stream = Readable.from(fileBuffer);
      const data = await pdf(stream);
      return data.text;
    }

    // Handle DOCX files
    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    }

    throw new Error('Unsupported file format. Please upload TXT, PDF, or DOCX files.');
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

module.exports = {
  extractTextFromFile
};
