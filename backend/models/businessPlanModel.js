const mongoose = require('mongoose');

const businessPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // --- User Inputs ---
  inputs: {
    businessName: { type: String, required: true },
    industry: { type: String, required: true },
    targetAudience: { type: String, required: true },
    description: { type: String, required: true },
    fundingNeeded: { type: String },
    location: { type: String },
    keyExpenses: { type: String },
  },
  // --- AI-Generated Output (Structured) ---
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating',
  },
  aiProvider: {
    type: String,
    enum: ['groq', 'gemini'],
  },
  executiveSummary: {
    overview: String,
    missionStatement: String,
    keyObjectives: [String],
  },
  marketAnalysis: {
    marketSize: String,
    targetMarketDescription: String,
    trends: [String],
    competitors: [
      {
        name: String,
        strengths: String,
        weaknesses: String,
      },
    ],
    competitiveAdvantage: String,
  },
  productsAndServices: {
    description: String,
    uniqueValueProposition: String,
    pricingStrategy: String,
    offerings: [
      {
        name: String,
        description: String,
        price: String,
      },
    ],
  },
  marketingStrategy: {
    channels: [String],
    customerAcquisition: String,
    retentionStrategy: String,
    launchPlan: String,
  },
  operationsPlan: {
    businessModel: String,
    keyActivities: [String],
    keyResources: [String],
    keyPartners: [String],
    location: String,
    teamStructure: String,
  },
  financialPlan: {
    startupCosts: String,
    revenueStreams: [String],
    projectedRevenue: [
      {
        period: String,
        amount: String,
      },
    ],
    breakEvenPoint: String,
    fundingRequirements: String,
  },
  riskAssessment: {
    risks: [
      {
        risk: String,
        mitigation: String,
      },
    ],
  },
  rawOutput: { type: String }, // fallback raw text if structured parsing fails
}, {
  timestamps: true,
});

const BusinessPlan = mongoose.model('BusinessPlan', businessPlanSchema);
module.exports = BusinessPlan;
