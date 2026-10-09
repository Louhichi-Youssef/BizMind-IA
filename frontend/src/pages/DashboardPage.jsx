import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit, LayoutDashboard, FileText, Target, LineChart,
  Settings, LogOut, Plus, Loader2, Trash2, ChevronRight,
  Sparkles, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMyPlans, deletePlan } from '../services/businessPlanService';
import Sidebar from '../components/Sidebar';

const statusColors = {
  completed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  generating: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

const DashboardPage = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getMyPlans();
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setPlansLoading(false);
      }
    };
    if (!loading) fetchPlans();
  }, [loading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (e, planId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this business plan?')) return;
    try {
      await deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p._id !== planId));
    } catch {
      alert('Failed to delete plan.');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[-20%] left-[50%] w-[50%] h-[50%] rounded-full bg-[#06B6D4]/5 blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 glass sticky top-0 z-10">
          <h1 className="text-xl font-bold font-['Sora']">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              id="new-business-plan-btn"
              onClick={() => navigate('/dashboard/generate')}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Business Plan
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-lg text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-4 sm:px-6 py-6 overflow-y-auto flex-1 max-w-7xl w-full mx-auto">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 glass rounded-2xl border border-white/8 bg-gradient-to-r from-[#2563EB]/5 to-[#7C3AED]/5 flex items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-xl font-bold font-['Sora'] mb-1">
                Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
              </h2>
              <p className="text-slate-400 text-sm">
                Ready to build something great? Generate an AI-powered business plan in seconds.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/generate')}
              className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:opacity-90 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate Plan
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <StatCard title="Total Plans" value={String(plans.length)} trend={plans.length > 0 ? `${plans.length} plan${plans.length > 1 ? 's' : ''} created` : 'No plans yet'} />
            <StatCard title="Completed Plans" value={String(plans.filter(p => p.status === 'completed').length)} trend="AI-generated" />
            <StatCard title="AI Models Used" value={[...new Set(plans.map(p => p.aiProvider).filter(Boolean))].length || '—'} trend="Groq + Gemini ready" />
          </div>

          {/* Business Plans Section */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-['Sora']">Your Business Plans</h2>
            <button
              onClick={() => navigate('/dashboard/generate')}
              className="flex items-center gap-1.5 text-sm text-[#2563EB] hover:text-[#93C5FD] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Plan
            </button>
          </div>

          {plansLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <EmptyState onGenerate={() => navigate('/dashboard/generate')} />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map((plan, i) => {
                const colors = statusColors[plan.status] || statusColors.completed;
                return (
                  <motion.div
                    key={plan._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/dashboard/plans/${plan._id}`)}
                    className="glass p-5 rounded-2xl border border-white/8 hover:border-white/15 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                          {plan.status}
                        </span>
                        <button
                          id={`delete-plan-${plan._id}-btn`}
                          onClick={(e) => handleDelete(e, plan._id)}
                          className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold mb-1 group-hover:text-[#06B6D4] transition-colors font-['Sora']">
                      {plan.inputs?.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">{plan.inputs?.industry}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="w-3 h-3" />
                        {formatDate(plan.createdAt)}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#06B6D4] transition-colors" />
                    </div>
                  </motion.div>
                );
              })}

              {/* New Plan Card */}
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => navigate('/dashboard/generate')}
                className="glass p-5 rounded-2xl border border-dashed border-white/10 hover:border-[#2563EB]/40 transition-all cursor-pointer group flex flex-col items-center justify-center gap-3 min-h-[140px]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-sm text-slate-400 group-hover:text-white transition-colors">Generate New Plan</p>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ─── Helper Components ────────────────────────────────────────────────────────
const StatCard = ({ title, value, trend }) => (
  <div className="glass p-5 rounded-xl border border-white/8">
    <h3 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">{title}</h3>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-xs text-[#06B6D4]">{trend}</div>
  </div>
);

const EmptyState = ({ onGenerate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-4">
      <Sparkles className="w-7 h-7 text-[#2563EB]" />
    </div>
    <h3 className="text-lg font-bold font-['Sora'] mb-2">No Business Plans Yet</h3>
    <p className="text-slate-400 text-sm mb-6 max-w-xs">
      Generate your first AI-powered business plan and get started building your vision.
    </p>
    <button
      id="create-first-plan-btn"
      onClick={onGenerate}
      className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
    >
      <Plus className="w-4 h-4" /> Create Your First Plan
    </button>
  </motion.div>
);

export default DashboardPage;
