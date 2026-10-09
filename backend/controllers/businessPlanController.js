const BusinessPlan = require('../models/businessPlanModel');
const { generateBusinessPlan } = require('../services/aiService');

// ─── Validation Helper ───────────────────────────────────────────────────────
const validateInputs = (inputs) => {
  const { businessName, industry, targetAudience, description } = inputs;
  const missing = [];
  if (!businessName) missing.push('businessName');
  if (!industry) missing.push('industry');
  if (!targetAudience) missing.push('targetAudience');
  if (!description) missing.push('description');
  return missing;
};

// ─── @desc    Generate a new business plan ───────────────────────────────────
// ─── @route   POST /api/business-plans/generate ─────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const generatePlan = async (req, res) => {
  try {
    const inputs = req.body;
    const missing = validateInputs(inputs);

    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    // Create a placeholder record first (status: 'generating')
    const plan = await BusinessPlan.create({
      user: req.user._id,
      inputs,
      status: 'generating',
    });

    // Generate the business plan via AI service
    const { structuredPlan, rawOutput, provider } = await generateBusinessPlan(inputs, req.user._id);

    // Build the update object from structured output
    const updateData = {
      status: 'completed',
      aiProvider: provider,
      rawOutput,
    };

    if (structuredPlan) {
      if (structuredPlan.executiveSummary) updateData.executiveSummary = structuredPlan.executiveSummary;
      if (structuredPlan.marketAnalysis) updateData.marketAnalysis = structuredPlan.marketAnalysis;
      if (structuredPlan.productsAndServices) updateData.productsAndServices = structuredPlan.productsAndServices;
      if (structuredPlan.marketingStrategy) updateData.marketingStrategy = structuredPlan.marketingStrategy;
      if (structuredPlan.operationsPlan) updateData.operationsPlan = structuredPlan.operationsPlan;
      if (structuredPlan.financialPlan) updateData.financialPlan = structuredPlan.financialPlan;
      if (structuredPlan.riskAssessment) updateData.riskAssessment = structuredPlan.riskAssessment;
    }

    const updatedPlan = await BusinessPlan.findByIdAndUpdate(
      plan._id,
      updateData,
      { new: true }
    );

    res.status(201).json(updatedPlan);
  } catch (error) {
    console.error('[BusinessPlanController] generatePlan error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to generate business plan.' });
  }
};

// ─── @desc    Get all plans for the logged-in user ───────────────────────────
// ─── @route   GET /api/business-plans ───────────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const getMyPlans = async (req, res) => {
  try {
    const plans = await BusinessPlan.find({ user: req.user._id })
      .select('inputs.businessName inputs.industry status aiProvider createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @desc    Get a single business plan by ID ───────────────────────────────
// ─── @route   GET /api/business-plans/:id ───────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const getPlanById = async (req, res) => {
  try {
    const plan = await BusinessPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found.' });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── @desc    Delete a business plan ─────────────────────────────────────────
// ─── @route   DELETE /api/business-plans/:id ─────────────────────────────────
// ─── @access  Private ────────────────────────────────────────────────────────
const deletePlan = async (req, res) => {
  try {
    const plan = await BusinessPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Business plan deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generatePlan, getMyPlans, getPlanById, deletePlan };
