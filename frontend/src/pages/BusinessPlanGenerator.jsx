import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, ChevronRight, ChevronLeft, Sparkles, Building2,
  Users, DollarSign, MapPin, FileText, Target, Loader2, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateBusinessPlan } from '../services/businessPlanService';

const steps = [
  { id: 1, title: 'Business Basics', icon: Building2, description: 'Tell us about your business' },
  { id: 2, title: 'Your Pitch', icon: Target, description: 'Describe your vision' },
  { id: 3, title: 'Financials', icon: DollarSign, description: 'Funding and expenses' },
];

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB]/60 focus:ring-2 focus:ring-[#2563EB]/20 transition-all text-sm';
const labelClass = 'block text-sm font-medium text-slate-300 mb-2';

export default function BusinessPlanGenerator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    description: '',
    fundingNeeded: '',
    location: '',
    keyExpenses: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validateStep = () => {
    if (currentStep === 0 && (!form.businessName || !form.industry)) {
      setError('Please fill in Business Name and Industry.');
      return false;
    }
    if (currentStep === 1 && (!form.targetAudience || !form.description)) {
      setError('Please fill in Target Audience and Business Description.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setGenerating(true);
    try {
      const plan = await generateBusinessPlan(form);
      setDone(true);
      setTimeout(() => navigate(`/dashboard/plans/${plan._id}`), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed. Please try again.');
      setGenerating(false);
    }
  };

  const industries = [
    'Technology / SaaS', 'E-commerce / Retail', 'Healthcare & Wellness',
    'Finance & Fintech', 'Education & EdTech', 'Food & Beverage',
    'Real Estate', 'Manufacturing', 'Creative & Media', 'Consulting & Services',
    'Agriculture', 'Transportation & Logistics', 'Other',
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-4 sm:px-6 py-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#2563EB]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#7C3AED]/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full px-4 py-1.5 text-sm text-[#93C5FD] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Business Plan Generator
          </div>
          <h1 className="text-3xl font-bold font-['Sora'] mb-2">Create Your Business Plan</h1>
          <p className="text-slate-400 text-sm">
            Answer a few questions and our AI will craft a comprehensive, investor-ready business plan in seconds.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    backgroundColor: i <= currentStep ? '#2563EB' : 'rgba(255,255,255,0.05)',
                    borderColor: i <= currentStep ? '#2563EB' : 'rgba(255,255,255,0.1)',
                  }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all"
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span className={i <= currentStep ? 'text-white' : 'text-slate-500'}>{i + 1}</span>
                  )}
                </motion.div>
                <span className={`text-xs font-medium hidden sm:block ${i <= currentStep ? 'text-white' : 'text-slate-500'}`}>
                  {step.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px max-w-[60px] ${i < currentStep ? 'bg-[#2563EB]' : 'bg-white/10'} transition-colors`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          className="glass rounded-2xl p-8 border border-white/8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {/* ── Step 1: Business Basics ── */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <StepHeader icon={Building2} title="Business Basics" subtitle="Start with the fundamentals" />
                <div>
                  <label className={labelClass}>Business Name *</label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="e.g. TechVault Solutions"
                    value={form.businessName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Industry *</label>
                  <select
                    id="industry"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="" disabled>Select your industry...</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind} className="bg-[#1E293B]">{ind}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Your Pitch ── */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <StepHeader icon={Target} title="Your Pitch" subtitle="Describe your vision and customers" />
                <div>
                  <label className={labelClass}>Target Audience *</label>
                  <input
                    id="targetAudience"
                    name="targetAudience"
                    type="text"
                    placeholder="e.g. Small business owners aged 25-45 in the US"
                    value={form.targetAudience}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Business Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Describe your business idea, the problem it solves, your solution, and what makes you unique..."
                    value={form.description}
                    onChange={handleChange}
                    className={inputClass + ' resize-none'}
                  />
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Financials ── */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <StepHeader icon={DollarSign} title="Financials & Logistics" subtitle="Optional but improves plan quality" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      <DollarSign className="w-3.5 h-3.5 inline mr-1 text-slate-400" />Funding Needed
                    </label>
                    <input
                      id="fundingNeeded"
                      name="fundingNeeded"
                      type="text"
                      placeholder="e.g. $150,000"
                      value={form.fundingNeeded}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="e.g. New York, USA"
                      value={form.location}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    <FileText className="w-3.5 h-3.5 inline mr-1 text-slate-400" />Key Expenses
                  </label>
                  <textarea
                    id="keyExpenses"
                    name="keyExpenses"
                    rows={3}
                    placeholder="e.g. Software development ($50K), Marketing ($30K), Office rent ($20K/yr)..."
                    value={form.keyExpenses}
                    onChange={handleChange}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                {/* Summary Preview */}
                <div className="mt-2 p-4 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/15">
                  <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Ready to generate:</p>
                  <p className="text-sm font-semibold text-white">{form.businessName}</p>
                  <p className="text-xs text-slate-400">{form.industry} · {form.targetAudience}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
            >
              {error}
            </motion.p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
            <button
              id="prev-step-btn"
              onClick={() => { navigate(-1); }}
              className={`flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 ${currentStep > 0 ? 'invisible' : ''}`}
            >
              Cancel
            </button>
            {currentStep > 0 && (
              <button
                id="prev-step-btn"
                onClick={prevStep}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                id="next-step-btn"
                onClick={nextStep}
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] ml-auto"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="generate-plan-btn"
                onClick={handleSubmit}
                disabled={generating}
                className="flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] ml-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : done ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Done! Redirecting...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    Generate with AI
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Generating overlay feedback */}
        <AnimatePresence>
          {generating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#2563EB]"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
                <p className="text-slate-400 text-sm">
                  Our AI is crafting your comprehensive business plan. This may take 15–30 seconds...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────
const StepHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h2 className="text-lg font-bold font-['Sora']">{title}</h2>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  </div>
);
