const { GoogleGenAI } = require('@google/genai');

class GeminiEmbedding {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // gemini-embedding-001 is the current state-of-the-art model (replaces text-embedding-004)
    this.modelName = 'gemini-embedding-001';
  }

  /**
   * Generates an embedding for a single text string.
   * @param {string} text - The input text.
   * @returns {Promise<number[]>} - The embedding vector.
   */
  async embedText(text) {
    try {
      const response = await this.client.models.embedContent({
        model: this.modelName,
        contents: text,
      });
      return response.embeddings[0].values;
    } catch (error) {
      console.error('[GeminiEmbedding Error]', error.message);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Generates embeddings for an array of texts (sequential to avoid rate limits).
   * @param {string[]} texts - Array of input texts.
   * @returns {Promise<number[][]>} - Array of embedding vectors.
   */
  async embedBatch(texts) {
    try {
      const embeddings = [];
      for (const text of texts) {
        const response = await this.client.models.embedContent({
          model: this.modelName,
          contents: text,
        });
        embeddings.push(response.embeddings[0].values);
      }
      return embeddings;
    } catch (error) {
      console.error('[GeminiEmbedding Batch Error]', error.message);
      throw new Error(`Failed to generate batch embeddings: ${error.message}`);
    }
  }
}

module.exports = new GeminiEmbedding();
