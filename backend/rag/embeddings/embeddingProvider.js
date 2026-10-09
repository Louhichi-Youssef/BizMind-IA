const geminiEmbedding = require('./geminiEmbedding');

// This abstraction layer allows swapping the embedding provider later
// (e.g., to OpenAI, Cohere, etc.) without changing the rest of the app.

class EmbeddingProvider {
  constructor(provider = 'gemini') {
    this.provider = provider;
  }

  /**
   * Get the active embedding client.
   */
  getClient() {
    if (this.provider === 'gemini') {
      return geminiEmbedding;
    }
    throw new Error(`Unsupported embedding provider: ${this.provider}`);
  }

  async embedText(text) {
    return await this.getClient().embedText(text);
  }

  async embedBatch(texts) {
    return await this.getClient().embedBatch(texts);
  }
}

module.exports = new EmbeddingProvider(process.env.EMBEDDING_PROVIDER || 'gemini');
