const { ChromaClient } = require('chromadb');

class ChromaDBClient {
  constructor() {
    // Connects to local ChromaDB server. Ensure Chroma is running or configured correctly.
    // For local Node usage, ChromaDB needs a running server or we connect via HTTP.
    this.client = new ChromaClient({ path: process.env.CHROMA_URL || 'http://localhost:8000' });
  }

  async _getCollection(userId) {
    // Each user gets their own collection to ensure data isolation.
    const collectionName = `user_${userId.toString()}`;
    return await this.client.getOrCreateCollection({
      name: collectionName,
    });
  }

  /**
   * Upsert chunks and embeddings into ChromaDB.
   */
  async upsert(userId, documentId, chunks, embeddings) {
    try {
      const collection = await this._getCollection(userId);
      
      const ids = chunks.map((_, i) => `${documentId}_chunk_${i}`);
      const metadatas = chunks.map(() => ({ documentId: documentId.toString() }));

      await collection.upsert({
        ids,
        embeddings,
        metadatas,
        documents: chunks,
      });

      return true;
    } catch (error) {
      console.error('[ChromaDB Upsert Error]', error.message);
      throw new Error(`Failed to store vectors in ChromaDB: ${error.message}`);
    }
  }

  /**
   * Search for similar chunks.
   */
  async search(userId, queryEmbedding, topK = 5) {
    try {
      const collection = await this._getCollection(userId);
      
      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
      });

      if (!results || !results.documents || results.documents.length === 0) {
        return [];
      }

      // results.documents[0] contains the top-K matched chunks for the first query
      return results.documents[0].map((text, i) => ({
        text,
        metadata: results.metadatas[0][i],
        distance: results.distances[0][i]
      }));
    } catch (error) {
      // Collection might not exist yet if they never uploaded, safely return empty
      if (error.message.includes('Collection') || error.message.includes('not found')) {
         return [];
      }
      console.error('[ChromaDB Search Error]', error.message);
      throw new Error(`Failed to search ChromaDB: ${error.message}`);
    }
  }

  /**
   * Delete a document's chunks from ChromaDB.
   */
  async deleteDocument(userId, documentId) {
    try {
      const collection = await this._getCollection(userId);
      await collection.delete({
        where: { documentId: documentId.toString() }
      });
      return true;
    } catch (error) {
      console.error('[ChromaDB Delete Error]', error.message);
      return false; // Ignore if it doesn't exist
    }
  }
}

module.exports = new ChromaDBClient();
