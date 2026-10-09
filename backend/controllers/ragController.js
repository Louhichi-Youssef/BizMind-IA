const ragService = require('../rag/ragService');

// ─── @desc    Upload and process a document for RAG ──────────────────────────
// ─── @route   POST /api/rag/upload ──────────────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Process document in the background to avoid blocking the HTTP response for too long
    // Alternatively, for a simpler flow, await it. We will await it for now since chunks are usually small.
    const doc = await ragService.processDocument(req.user._id, req.file);
    
    res.status(201).json(doc);
  } catch (error) {
    console.error('[RAG Controller] Upload Error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to process document.' });
  }
};

// ─── @desc    Get all user documents ─────────────────────────────────────────
// ─── @route   GET /api/rag/documents ────────────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const getDocuments = async (req, res) => {
  try {
    const docs = await ragService.getDocuments(req.user._id);
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @desc    Delete a document and its embeddings ───────────────────────────
// ─── @route   DELETE /api/rag/documents/:id ──────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const deleteDocument = async (req, res) => {
  try {
    await ragService.deleteDocument(req.user._id, req.params.id);
    res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadDocument, getDocuments, deleteDocument };
