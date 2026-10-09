import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#2563EB]/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="glass p-8 md:p-10 rounded-2xl border-white/10 w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-['Sora'] text-white">BizMind</span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">Create an account</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Start building smarter businesses today</p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password" name="password" value={formData.password} onChange={handleChange} required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              placeholder="Password"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2 mt-2">
            {isLoading ? 'Creating Account...' : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Already have an account? <Link to="/login" className="text-[#06B6D4] hover:text-white font-medium transition-colors">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
