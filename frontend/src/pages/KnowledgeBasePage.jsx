import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Loader2, Trash2, CheckCircle2, AlertCircle, FileText, FileSpreadsheet } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const KnowledgeBasePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/rag/documents', { headers: getAuthHeader() });
      // Ensure we always set an array to prevent .map() crash
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    setError('');
    const validTypes = [
      'application/pdf', 
      'text/plain', 
      'text/csv', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/csv'
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      setError('Invalid file type. Please upload PDF, DOCX, TXT, or CSV.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/rag/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      await fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.delete(`/rag/documents/${id}`, { headers: getAuthHeader() });
      setDocuments(docs => docs.filter(d => d._id !== id));
    } catch (err) {
      alert('Failed to delete document.');
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (mimeType.includes('csv')) return <FileSpreadsheet className="w-5 h-5 text-green-400" />;
    if (mimeType.includes('word')) return <FileText className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative px-4 sm:px-6 py-6">
        <div className="absolute top-[-20%] left-[50%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl w-full mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold font-['Sora'] mb-2">Knowledge Base</h1>
            <p className="text-slate-400 text-sm">
              Upload documents to build a private knowledge base. The AI will securely retrieve and use this context when generating business plans.
            </p>
          </header>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-10 mb-8 flex flex-col items-center justify-center transition-all ${
              dragActive ? 'border-[#2563EB] bg-[#2563EB]/5' : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drag & drop a file here</h3>
            <p className="text-sm text-slate-400 mb-6">Supports PDF, DOCX, TXT, CSV up to 10MB</p>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt,.csv"
              onChange={handleChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Browse Files'}
            </button>
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </div>

          {/* Document List */}
          <div>
            <h2 className="text-lg font-bold font-['Sora'] mb-4">Your Documents</h2>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5 text-slate-400 text-sm">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={doc._id}
                    className="flex items-center justify-between p-4 glass rounded-xl border border-white/8 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        {getFileIcon(doc.mimeType)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">{doc.originalName}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span>{formatSize(doc.size)}</span>
                          <span>·</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          <span>·</span>
                          {doc.status === 'ready' && <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Ready</span>}
                          {doc.status === 'processing' && <span className="text-blue-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Processing</span>}
                          {doc.status === 'error' && <span className="text-red-400 flex items-center gap-1" title={doc.errorMessage}><AlertCircle className="w-3 h-3"/> Error</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBasePage;
