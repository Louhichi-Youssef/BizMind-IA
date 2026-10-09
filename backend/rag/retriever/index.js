const embeddingProvider = require('../embeddings/embeddingProvider');
const vectorStore = require('../vectorStore/vectorStoreProvider');

/**
 * The Retriever module is responsible for orchestrating searches across various sources.
 * Currently, it fetches context from the Vector Store (RAG).
 * In the future, this can be expanded to include Web Search or Internal Knowledge Bases.
 */
class Retriever {
  
  /**
   * Main retrieval method to get context for a query.
   * @param {string} userId - The user ID for isolated access.
   * @param {string} query - The search query.
   * @param {number} topK - Number of results to return (default 5).
   * @returns {Promise<string>} - Aggregated context string.
   */
  async retrieveContext(userId, query, topK = 5) {
    if (!query) return '';

    try {
      console.log(`[Retriever] Searching for context (query: "${query.substring(0, 50)}...")`);
      
      // 1. Generate query embedding
      const queryEmbedding = await embeddingProvider.embedText(query);
      
      // 2. Search Vector Store (RAG)
      const ragResults = await vectorStore.search(userId, queryEmbedding, topK);
      
      // 3. (Future) Search Web
      // const webResults = await webSearchProvider.search(query);
      
      // 4. (Future) Search Internal DB
      // const internalResults = await internalKbProvider.search(query);

      // Aggregate all contexts
      let contextStr = '';

      if (ragResults && ragResults.length > 0) {
        contextStr += '=== Document Knowledge Base ===\n';
        ragResults.forEach((result, i) => {
          contextStr += `[Source ${i + 1}]: ${result.text}\n\n`;
        });
      }

      return contextStr.trim();
    } catch (error) {
      console.error('[Retriever Error]', error.message);
      // Fail gracefully so the AI generation can continue even if retrieval fails
      return ''; 
    }
  }
}

module.exports = new Retriever();
