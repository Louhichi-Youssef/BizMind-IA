const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const csvParser = require('csv-parser');
const { Readable } = require('stream');

/**
 * Parses different file types into raw text.
 * @param {Buffer} buffer - The file buffer.
 * @param {string} mimeType - The file MIME type.
 * @returns {Promise<string>} - Extracted text.
 */
const parseFile = async (buffer, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } 
    
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } 
    
    if (mimeType === 'text/plain') {
      return buffer.toString('utf-8');
    } 
    
    if (mimeType === 'text/csv' || mimeType === 'application/csv') {
      return new Promise((resolve, reject) => {
        const results = [];
        const stream = Readable.from(buffer.toString('utf-8'));
        
        stream
          .pipe(csvParser())
          .on('data', (data) => {
            results.push(Object.values(data).join(', '));
          })
          .on('end', () => {
            resolve(results.join('\n'));
          })
          .on('error', (err) => reject(err));
      });
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
  } catch (error) {
    console.error('[Parser Error]', error.message);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

module.exports = { parseFile };
