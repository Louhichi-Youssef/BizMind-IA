const { parseFile } = require('./parser');
const { chunkText } = require('./chunker');
const embeddingProvider = require('./embeddings/embeddingProvider');
const vectorStore = require('./vectorStore/vectorStoreProvider');
const retriever = require('./retriever');
const Document = require('../models/documentModel');
const fs = require('fs');

class RagService {
  /**
   * Process a newly uploaded document.
   * Parses text -> Chunks text -> Embeds chunks -> Saves to Vector Store -> Updates DB
   */
  async processDocument(userId, file) {
    const { originalname, mimetype, size, path } = file;
    
    // Create tracking document in DB
    const doc = await Document.create({
      user: userId,
      filename: file.filename, // Multer generated name
      originalName: originalname,
      mimeType: mimetype,
      size,
      status: 'processing'
    });

    try {
      // 1. Read file buffer
      const buffer = fs.readFileSync(path);

      // 2. Parse text
      const rawText = await parseFile(buffer, mimetype);
      
      if (!rawText || rawText.trim() === '') {
        throw new Error('Extracted text is empty. The file might not contain readable text.');
      }

      // 3. Chunk text (800-1000 characters, overlap 150-200 as requested)
      const chunks = chunkText(rawText, 1000, 200);
      
      if (chunks.length === 0) {
        throw new Error('No chunks generated from the document.');
      }

      // 4. Generate embeddings
      const embeddings = await embeddingProvider.embedBatch(chunks);

      // 5. Store in Vector Database
      await vectorStore.upsert(userId, doc._id, chunks, embeddings);

      // 6. Update DB status to ready
      doc.status = 'ready';
      await doc.save();
      
      // Clean up temp file
      fs.unlinkSync(path);
      
      return doc;
    } catch (error) {
      console.error(`[RAG Service Error - processDocument]`, error.message);
      doc.status = 'error';
      doc.errorMessage = error.message;
      await doc.save();
      
      if (fs.existsSync(path)) {
         fs.unlinkSync(path);
      }
      
      throw error;
    }
  }

  /**
   * Retrieve relevant context for an AI prompt.
   * @param {string} userId - The user ID.
   * @param {string} query - The query to search.
   */
  async retrieveContext(userId, query) {
    return await retriever.retrieveContext(userId, query, 5); // Default Top-K = 5
  }

  /**
   * Delete a document and its vectors.
   */
  async deleteDocument(userId, documentId) {
    await vectorStore.deleteDocument(userId, documentId);
    await Document.findOneAndDelete({ _id: documentId, user: userId });
  }

  /**
   * Get all documents for a user.
   */
  async getDocuments(userId) {
    return await Document.find({ user: userId }).sort({ createdAt: -1 });
  }
}

module.exports = new RagService();
