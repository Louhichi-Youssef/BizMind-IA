const path = require('path');
const fs = require('fs');

// LanceDB is an embedded vector database - no server, no Docker needed.
// Data is stored in local files inside backend/vector_data/
let lancedb;
try {
  lancedb = require('@lancedb/lancedb');
} catch (e) {
  console.error('[LanceDB] Package not found. Run: npm install @lancedb/lancedb apache-arrow');
  process.exit(1);
}

const DB_PATH = path.join(__dirname, '../../vector_data');

class LanceDBClient {
  constructor() {
    this.db = null;
    // Ensure the vector_data directory exists
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(DB_PATH, { recursive: true });
    }
  }

  async _connect() {
    if (!this.db) {
      this.db = await lancedb.connect(DB_PATH);
    }
    return this.db;
  }

  /**
   * Each user has their own isolated LanceDB table.
   */
  _tableName(userId) {
    return `user_${userId.toString()}`;
  }

  /**
   * Upsert (insert or update) chunks and embeddings for a document.
   */
  async upsert(userId, documentId, chunks, embeddings) {
    try {
      const db = await this._connect();
      const tableName = this._tableName(userId);
      const docId = documentId.toString();

      // Build the rows to insert
      const rows = chunks.map((text, i) => ({
        id: `${docId}_chunk_${i}`,
        text,
        documentId: docId,
        vector: embeddings[i],
      }));

      // Check if table exists
      const tableNames = await db.tableNames();

      if (tableNames.includes(tableName)) {
        const table = await db.openTable(tableName);
        // Delete old chunks for this document first (upsert by delete+insert)
        try {
          await table.delete(`documentId = '${docId}'`);
        } catch (e) {
          // Table may be empty, ignore
        }
        await table.add(rows);
      } else {
        // Create the table with the first batch of data
        await db.createTable(tableName, rows);
      }

      console.log(`[LanceDB] Stored ${rows.length} chunks for document ${docId}`);
      return true;
    } catch (error) {
      console.error('[LanceDB Upsert Error]', error.message);
      throw new Error(`Failed to store vectors in LanceDB: ${error.message}`);
    }
  }

  /**
   * Search for the most similar chunks using vector similarity.
   */
  async search(userId, queryEmbedding, topK = 5) {
    try {
      const db = await this._connect();
      const tableName = this._tableName(userId);

      const tableNames = await db.tableNames();
      if (!tableNames.includes(tableName)) {
        // No documents uploaded yet for this user
        return [];
      }

      const table = await db.openTable(tableName);

      const results = await table
        .vectorSearch(queryEmbedding)
        .limit(topK)
        .toArray();

      if (!results || results.length === 0) return [];

      return results.map((row) => ({
        text: row.text,
        metadata: { documentId: row.documentId },
        distance: row._distance,
      }));
    } catch (error) {
      console.error('[LanceDB Search Error]', error.message);
      // Fail gracefully so generation can still proceed
      return [];
    }
  }

  /**
   * Delete all chunks belonging to a specific document.
   */
  async deleteDocument(userId, documentId) {
    try {
      const db = await this._connect();
      const tableName = this._tableName(userId);
      const docId = documentId.toString();

      const tableNames = await db.tableNames();
      if (!tableNames.includes(tableName)) return true;

      const table = await db.openTable(tableName);
      await table.delete(`documentId = '${docId}'`);
      console.log(`[LanceDB] Deleted chunks for document ${docId}`);
      return true;
    } catch (error) {
      console.error('[LanceDB Delete Error]', error.message);
      return false;
    }
  }
}

module.exports = new LanceDBClient();
