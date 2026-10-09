const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/ragController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for temp storage
const upload = multer({ dest: 'uploads/' });

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/documents', protect, getDocuments);
router.delete('/documents/:id', protect, deleteDocument);

module.exports = router;
