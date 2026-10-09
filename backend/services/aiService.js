const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ragService = require('../rag/ragService');

// ─── AI Clients ──────────────────────────────────────────────────────────────
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Prompt Builder ───────────────────────────────────────────────────────────
/**
 * Builds a detailed system prompt for structured business plan generation.
 * The AI is instructed to return ONLY valid JSON matching the expected schema.
 */
const buildBusinessPlanPrompt = (inputs, context) => {
  const { businessName, industry, targetAudience, description, fundingNeeded, location, keyExpenses } = inputs;

  let contextInjection = '';
  if (context) {
    contextInjection = `\n\n=== RELEVANT CONTEXT (From Knowledge Base) ===\n${context}\n\nUse the above context to enrich the business plan with specific facts, data, and insights where appropriate.`;
  }

  return `You are an expert business plan consultant and strategist with 20+ years of experience.

Generate a comprehensive, professional business plan for the following business:

- Business Name: ${businessName}
- Industry: ${industry}
- Target Audience: ${targetAudience}
- Business Description: ${description}
- Funding Needed: ${fundingNeeded || 'Not specified'}
- Location: ${location || 'Not specified'}
- Key Expenses: ${keyExpenses || 'Not specified'}${contextInjection}

CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object. No markdown, no code blocks, no explanation text. Just raw JSON.

The JSON must follow this exact structure:
{
  "executiveSummary": {
    "overview": "2-3 paragraph compelling overview of the business",
    "missionStatement": "One clear mission statement",
    "keyObjectives": ["objective 1", "objective 2", "objective 3", "objective 4", "objective 5"]
  },
  "marketAnalysis": {
    "marketSize": "Description of total addressable market size and value",
    "targetMarketDescription": "Detailed description of target customers, demographics, psychographics",
    "trends": ["trend 1", "trend 2", "trend 3", "trend 4"],
    "competitors": [
      { "name": "Competitor Name", "strengths": "Their main strengths", "weaknesses": "Their main weaknesses" },
      { "name": "Competitor Name 2", "strengths": "Their main strengths", "weaknesses": "Their main weaknesses" },
      { "name": "Competitor Name 3", "strengths": "Their main strengths", "weaknesses": "Their main weaknesses" }
    ],
    "competitiveAdvantage": "Detailed explanation of our unique competitive advantage"
  },
  "productsAndServices": {
    "description": "Detailed description of what we offer",
    "uniqueValueProposition": "Clear UVP statement",
    "pricingStrategy": "Detailed pricing strategy explanation",
    "offerings": [
      { "name": "Product/Service Name", "description": "Description", "price": "Price range or model" },
      { "name": "Product/Service Name 2", "description": "Description", "price": "Price range or model" }
    ]
  },
  "marketingStrategy": {
    "channels": ["channel 1", "channel 2", "channel 3", "channel 4"],
    "customerAcquisition": "Detailed customer acquisition strategy",
    "retentionStrategy": "Customer retention and loyalty strategy",
    "launchPlan": "Step-by-step go-to-market launch plan for the first 90 days"
  },
  "operationsPlan": {
    "businessModel": "Explanation of the core business model (how money is made)",
    "keyActivities": ["activity 1", "activity 2", "activity 3"],
    "keyResources": ["resource 1", "resource 2", "resource 3"],
    "keyPartners": ["partner type 1", "partner type 2"],
    "location": "Operational location and facility details",
    "teamStructure": "Organizational structure and key roles needed"
  },
  "financialPlan": {
    "startupCosts": "Detailed breakdown of initial startup costs",
    "revenueStreams": ["revenue stream 1", "revenue stream 2", "revenue stream 3"],
    "projectedRevenue": [
      { "period": "Month 1-3", "amount": "Projected revenue with justification" },
      { "period": "Month 4-6", "amount": "Projected revenue with justification" },
      { "period": "Month 7-12", "amount": "Projected revenue with justification" },
      { "period": "Year 2", "amount": "Projected revenue with justification" },
      { "period": "Year 3", "amount": "Projected revenue with justification" }
    ],
    "breakEvenPoint": "When and how break-even will be achieved",
    "fundingRequirements": "Detailed funding requirements and intended use of funds"
  },
  "riskAssessment": {
    "risks": [
      { "risk": "Risk description", "mitigation": "Mitigation strategy" },
      { "risk": "Risk description 2", "mitigation": "Mitigation strategy 2" },
      { "risk": "Risk description 3", "mitigation": "Mitigation strategy 3" },
      { "risk": "Risk description 4", "mitigation": "Mitigation strategy 4" }
    ]
  }
}`;
};

// ─── JSON Extractor ───────────────────────────────────────────────────────────
/**
 * Attempts to extract and parse JSON from an AI response string.
 * Handles both raw JSON and markdown-wrapped JSON blocks.
 */
const extractJSON = (text) => {
  // Try direct parse first
  try {
    return JSON.parse(text.trim());
  } catch (_) {}

  // Try extracting from markdown code block
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch (_) {}
  }

  // Try finding the first { ... } block
  const braceMatch = text.match(/\{[\s\S]+\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch (_) {}
  }

  return null;
};

// ─── Groq Generator ───────────────────────────────────────────────────────────
const generateWithGroq = async (prompt) => {
  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a professional business plan expert. You ONLY respond with valid, raw JSON. Never use markdown. Never add explanations outside the JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });

  const rawText = completion.choices[0]?.message?.content || '';
  return { rawText, provider: 'groq' };
};

// ─── Gemini Generator ─────────────────────────────────────────────────────────
const generateWithGemini = async (prompt) => {
  const model = geminiClient.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  return { rawText, provider: 'gemini' };
};

// ─── Main Service Function ────────────────────────────────────────────────────
/**
 * Generates a structured business plan using Groq (primary) with Gemini as fallback.
 *
 * @param {Object} inputs - Business inputs from the user
 * @param {string} userId - The user ID
 * @returns {{ structuredPlan: Object|null, rawOutput: string, provider: string }}
 */
const generateBusinessPlan = async (inputs, userId) => {
  // 1. Research Agent Step: Retrieve context from RAG
  const query = `${inputs.businessName} ${inputs.industry} ${inputs.description}`;
  let context = '';
  if (userId) {
     context = await ragService.retrieveContext(userId, query);
  }

  const prompt = buildBusinessPlanPrompt(inputs, context);
  let rawText = '';
  let provider = '';
  let structuredPlan = null;

  // --- Primary: Groq ---
  try {
    console.log('[AI Service] Attempting generation with Groq...');
    const result = await generateWithGroq(prompt);
    rawText = result.rawText;
    provider = result.provider;
    structuredPlan = extractJSON(rawText);

    if (structuredPlan) {
      console.log('[AI Service] Groq succeeded with structured JSON output.');
      return { structuredPlan, rawOutput: rawText, provider };
    } else {
      console.warn('[AI Service] Groq response could not be parsed as JSON. Falling back to Gemini.');
    }
  } catch (groqError) {
    console.error('[AI Service] Groq failed:', groqError.message);
    console.log('[AI Service] Falling back to Gemini...');
  }

  // --- Fallback: Gemini ---
  try {
    const result = await generateWithGemini(prompt);
    rawText = result.rawText;
    provider = result.provider;
    structuredPlan = extractJSON(rawText);

    if (structuredPlan) {
      console.log('[AI Service] Gemini succeeded with structured JSON output.');
    } else {
      console.warn('[AI Service] Gemini response could not be parsed as JSON. Saving raw output.');
    }

    return { structuredPlan, rawOutput: rawText, provider };
  } catch (geminiError) {
    console.error('[AI Service] Gemini also failed:', geminiError.message);
    throw new Error('All AI providers failed to generate a business plan. Please try again later.');
  }
};

module.exports = { generateBusinessPlan };
