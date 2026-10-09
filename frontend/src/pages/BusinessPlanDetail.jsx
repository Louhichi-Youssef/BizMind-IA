import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, ChevronDown, ChevronUp, ArrowLeft, Loader2,
  FileText, BarChart2, Megaphone, Settings2, DollarSign, AlertTriangle,
  ShoppingBag, CheckCircle2, Trash2, Calendar, Download
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlanById, deletePlan } from '../services/businessPlanService';

const SECTIONS = [
  { key: 'executiveSummary',   label: 'Executive Summary',    icon: FileText,       color: '#2563EB' },
  { key: 'marketAnalysis',     label: 'Market Analysis',      icon: BarChart2,      color: '#7C3AED' },
  { key: 'productsAndServices',label: 'Products & Services',  icon: ShoppingBag,    color: '#06B6D4' },
  { key: 'marketingStrategy',  label: 'Marketing Strategy',   icon: Megaphone,      color: '#10B981' },
  { key: 'operationsPlan',     label: 'Operations Plan',      icon: Settings2,      color: '#F59E0B' },
  { key: 'financialPlan',      label: 'Financial Plan',       icon: DollarSign,     color: '#EF4444' },
  { key: 'riskAssessment',     label: 'Risk Assessment',      icon: AlertTriangle,  color: '#EC4899' },
];

export default function BusinessPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSections, setOpenSections] = useState({ executiveSummary: true });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getPlanById(id);
        setPlan(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load business plan.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportPDF = () => {
    setOpenSections({
      executiveSummary: true,
      marketAnalysis: true,
      productsAndServices: true,
      marketingStrategy: true,
      operationsPlan: true,
      financialPlan: true,
      riskAssessment: true,
    });
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this business plan? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deletePlan(id);
      navigate('/dashboard');
    } catch {
      setDeleting(false);
      alert('Failed to delete plan.');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        <p className="text-slate-400 text-sm">Loading your business plan...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-400">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[30%] w-[50%] h-[40%] rounded-full bg-[#2563EB]/4 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#7C3AED]/4 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            id="back-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <button
              id="export-pdf-btn"
              onClick={handleExportPDF}
              className="flex items-center gap-2 text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-sm px-3.5 py-1.5 rounded-lg shadow-sm font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            <button
              id="delete-plan-btn"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-500/20 transition-colors text-sm px-3 py-1.5 rounded-lg border border-red-500/20 cursor-pointer"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Delete Plan
            </button>
          </div>
        </div>

        {/* Plan Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#93C5FD] uppercase tracking-wider">AI Business Plan</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 capitalize">{plan.aiProvider} model</span>
                    {plan.status === 'completed' && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold font-['Sora']">{plan.inputs.businessName}</h1>
              <p className="text-slate-400 mt-1">{plan.inputs.industry}</p>
            </div>
            <div className="glass rounded-xl px-4 py-3 text-right">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Calendar className="w-3 h-3" /> Generated
              </div>
              <p className="text-sm text-white font-medium">{formatDate(plan.createdAt)}</p>
            </div>
          </div>

          {/* Key Info Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: plan.inputs.targetAudience, icon: '🎯' },
              plan.inputs.location && { label: plan.inputs.location, icon: '📍' },
              plan.inputs.fundingNeeded && { label: plan.inputs.fundingNeeded, icon: '💰' },
            ].filter(Boolean).map((chip, i) => (
              <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-300">
                {chip.icon} {chip.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map(({ key, label, icon: Icon, color }) => {
            const sectionData = plan[key];
            const isOpen = openSections[key];
            if (!sectionData) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl overflow-hidden border border-white/8"
              >
                {/* Section Header */}
                <button
                  id={`section-${key}-btn`}
                  onClick={() => toggleSection(key)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="font-semibold text-sm">{label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key={key + '-content'}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/5 pt-5">
                        <SectionContent data={sectionData} sectionKey={key} color={color} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-slate-600">
          Generated by BizMind AI · {plan.aiProvider?.charAt(0).toUpperCase() + plan.aiProvider?.slice(1)} · {formatDate(plan.createdAt)}
        </div>
      </div>
    </div>
  );
}

// ─── Section Content Renderer ─────────────────────────────────────────────────
function SectionContent({ data, sectionKey, color }) {
  if (!data) return null;

  if (sectionKey === 'executiveSummary') return (
    <div className="space-y-4">
      {data.overview && <p className="text-slate-300 text-sm leading-relaxed">{data.overview}</p>}
      {data.missionStatement && (
        <div className="p-4 rounded-xl border-l-4" style={{ borderColor: color, backgroundColor: `${color}08` }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color }}>Mission Statement</p>
          <p className="text-sm text-slate-200 italic">"{data.missionStatement}"</p>
        </div>
      )}
      {data.keyObjectives?.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Key Objectives</p>
          <ul className="space-y-2">
            {data.keyObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (sectionKey === 'marketAnalysis') return (
    <div className="space-y-5">
      {data.marketSize && <InfoBlock label="Market Size" value={data.marketSize} />}
      {data.targetMarketDescription && <InfoBlock label="Target Market" value={data.targetMarketDescription} />}
      {data.trends?.length > 0 && <TagList label="Key Trends" items={data.trends} color={color} />}
      {data.competitors?.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Competitive Landscape</p>
          <div className="space-y-3">
            {data.competitors.map((comp, i) => (
              <div key={i} className="p-4 bg-white/3 rounded-xl border border-white/5">
                <p className="font-semibold text-sm mb-2">{comp.name}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-green-400 font-medium mb-1">✓ Strengths</p>
                    <p className="text-xs text-slate-300">{comp.strengths}</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-400 font-medium mb-1">✗ Weaknesses</p>
                    <p className="text-xs text-slate-300">{comp.weaknesses}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.competitiveAdvantage && <InfoBlock label="Our Competitive Advantage" value={data.competitiveAdvantage} highlight color={color} />}
    </div>
  );

  if (sectionKey === 'productsAndServices') return (
    <div className="space-y-5">
      {data.description && <InfoBlock label="Overview" value={data.description} />}
      {data.uniqueValueProposition && (
        <div className="p-4 rounded-xl border-l-4" style={{ borderColor: color, backgroundColor: `${color}08` }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color }}>Unique Value Proposition</p>
          <p className="text-sm text-slate-200">{data.uniqueValueProposition}</p>
        </div>
      )}
      {data.pricingStrategy && <InfoBlock label="Pricing Strategy" value={data.pricingStrategy} />}
      {data.offerings?.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Offerings</p>
          <div className="space-y-2">
            {data.offerings.map((off, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-3 bg-white/3 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium text-sm">{off.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{off.description}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg shrink-0" style={{ backgroundColor: `${color}15`, color }}>
                  {off.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (sectionKey === 'marketingStrategy') return (
    <div className="space-y-5">
      {data.channels?.length > 0 && <TagList label="Marketing Channels" items={data.channels} color={color} />}
      {data.customerAcquisition && <InfoBlock label="Customer Acquisition" value={data.customerAcquisition} />}
      {data.retentionStrategy && <InfoBlock label="Retention Strategy" value={data.retentionStrategy} />}
      {data.launchPlan && <InfoBlock label="90-Day Launch Plan" value={data.launchPlan} highlight color={color} />}
    </div>
  );

  if (sectionKey === 'operationsPlan') return (
    <div className="space-y-5">
      {data.businessModel && <InfoBlock label="Business Model" value={data.businessModel} />}
      {data.keyActivities?.length > 0 && <TagList label="Key Activities" items={data.keyActivities} color={color} />}
      {data.keyResources?.length > 0 && <TagList label="Key Resources" items={data.keyResources} color={color} />}
      {data.keyPartners?.length > 0 && <TagList label="Key Partners" items={data.keyPartners} color={color} />}
      {data.teamStructure && <InfoBlock label="Team Structure" value={data.teamStructure} />}
    </div>
  );

  if (sectionKey === 'financialPlan') return (
    <div className="space-y-5">
      {data.startupCosts && <InfoBlock label="Startup Costs" value={data.startupCosts} />}
      {data.revenueStreams?.length > 0 && <TagList label="Revenue Streams" items={data.revenueStreams} color={color} />}
      {data.projectedRevenue?.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Revenue Projections</p>
          <div className="space-y-2">
            {data.projectedRevenue.map((rev, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5">
                <span className="text-sm text-slate-300">{rev.period}</span>
                <span className="text-sm font-semibold" style={{ color }}>{rev.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.breakEvenPoint && <InfoBlock label="Break-Even Point" value={data.breakEvenPoint} />}
      {data.fundingRequirements && <InfoBlock label="Funding Requirements" value={data.fundingRequirements} highlight color={color} />}
    </div>
  );

  if (sectionKey === 'riskAssessment') return (
    <div className="space-y-3">
      {data.risks?.map((item, i) => (
        <div key={i} className="p-4 bg-white/3 rounded-xl border border-white/5">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-sm font-semibold text-slate-200">{item.risk}</p>
          </div>
          <p className="text-xs text-slate-400 pl-6">
            <span className="text-green-400 font-medium">Mitigation: </span>{item.mitigation}
          </p>
        </div>
      ))}
    </div>
  );

  return null;
}

// ─── Reusable Sub-Components ─────────────────────────────────────────────────
const InfoBlock = ({ label, value, highlight, color }) => (
  <div className={highlight ? `p-4 rounded-xl border-l-4` : ''} style={highlight ? { borderColor: color, backgroundColor: `${color}08` } : {}}>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
    <p className="text-sm text-slate-300 leading-relaxed">{value}</p>
  </div>
);

const TagList = ({ label, items, color }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{label}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="text-xs px-3 py-1 rounded-full border"
          style={{ backgroundColor: `${color}10`, borderColor: `${color}25`, color }}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);
