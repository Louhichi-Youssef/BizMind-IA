/**
 * Semantically chunks text with a specified target size and overlap.
 * Uses paragraphs or sentences where possible.
 * @param {string} text - The raw extracted text.
 * @param {number} targetSize - Target chunk size in characters.
 * @param {number} overlap - Overlap size in characters.
 * @returns {string[]} Array of text chunks.
 */
const chunkText = (text, targetSize = 1000, overlap = 200) => {
  if (!text || text.trim() === '') return [];

  // Clean text
  const cleanText = text.replace(/[\r\n]+/g, '\n').trim();

  const chunks = [];
  let startIndex = 0;

  while (startIndex < cleanText.length) {
    let endIndex = startIndex + targetSize;

    if (endIndex >= cleanText.length) {
      endIndex = cleanText.length;
    } else {
      // Try to find a good breaking point (newline or period) near the endIndex
      let breakPoint = cleanText.lastIndexOf('\n', endIndex);
      
      // If no newline found within a reasonable distance, look for a period
      if (breakPoint < startIndex + targetSize * 0.5) {
        breakPoint = cleanText.lastIndexOf('. ', endIndex);
      }
      
      // If still no good breakpoint, just cut it at a space
      if (breakPoint < startIndex + targetSize * 0.5) {
        breakPoint = cleanText.lastIndexOf(' ', endIndex);
      }

      if (breakPoint > startIndex) {
        endIndex = breakPoint + 1; // Include the breaking character
      }
    }

    const chunk = cleanText.slice(startIndex, endIndex).trim();
    if (chunk) {
      chunks.push(chunk);
    }

    startIndex = endIndex - overlap;
    
    // Safety check to prevent infinite loops if overlap is too big relative to chunk advancement
    if (startIndex <= 0 || endIndex - overlap <= chunks[chunks.length - 1].length) {
       // if we aren't advancing properly, force advance
       startIndex = endIndex;
    } else {
       // ensure we always advance at least something
       startIndex = Math.max(startIndex, chunks[chunks.length - 1].length > overlap ? endIndex - overlap : endIndex);
    }
  }

  return chunks;
};

module.exports = { chunkText };
