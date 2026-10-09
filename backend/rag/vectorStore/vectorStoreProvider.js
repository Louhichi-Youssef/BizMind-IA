const chromaClient = require('./chromaClient');
const lanceClient = require('./lanceClient');

// Abstraction layer — switch providers via VECTOR_STORE_PROVIDER in .env
// Supported values: 'lance' (default, embedded, no server) | 'chroma' (requires Docker)
class VectorStoreProvider {
  constructor(provider = 'lance') {
    this.provider = provider;
    console.log(`[VectorStore] Using provider: ${this.provider}`);
  }

  getClient() {
    if (this.provider === 'lance') {
      return lanceClient;
    }
    if (this.provider === 'chroma') {
      return chromaClient;
    }
    throw new Error(`Unsupported vector store provider: ${this.provider}`);
  }

  async upsert(userId, documentId, chunks, embeddings) {
    return await this.getClient().upsert(userId, documentId, chunks, embeddings);
  }

  async search(userId, queryEmbedding, topK = 5) {
    return await this.getClient().search(userId, queryEmbedding, topK);
  }

  async deleteDocument(userId, documentId) {
    return await this.getClient().deleteDocument(userId, documentId);
  }
}

module.exports = new VectorStoreProvider(process.env.VECTOR_STORE_PROVIDER || 'lance');
