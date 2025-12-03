import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

export interface ChangeIndicator {
  tooth_region: string; // Changed from tooth_number to avoid false precision
  region: {
    x: number; // Percentage position
    y: number;
    width: number;
    height: number;
  };
  change_level: 'minimal' | 'moderate' | 'significant'; // Changed from severity
  description: string;
  priority: 'review' | 'attention' | 'urgent';
}

export interface AnalysisResult {
  id: string;
  baseline_xray_id: string;
  current_xray_id: string;
  overall_summary: string; // Changed from assessment
  health_score: number; // 0-10 scale, replaces average_bone_loss
  score_change: number; // -10 to +10, indicates improvement/decline
  concern_level: 'low' | 'medium' | 'high'; // Changed from risk_level
  indicators: ChangeIndicator[]; // Changed from annotations
  discussion_points: string[]; // Changed from recommendations
  analysis_date: string;
  confidence: 'low' | 'medium' | 'high';
  is_demo_data: boolean; // Important flag!
}

/**
 * DEMO MODE: Analyze X-ray comparison for demonstration purposes
 *
 * ⚠️ IMPORTANT: This generates sample data for UI demonstration only.
 * This is NOT a medical diagnostic tool and should NOT be used for clinical decisions.
 *
 * For real medical analysis, integrate with FDA-approved diagnostic APIs
 * such as Overjet or Denti.AI.
 */
export async function analyzeXRayComparison(
  baselineImageUrl: string,
  currentImageUrl: string
): Promise<AnalysisResult> {
  try {
    // DEMO MODE: Generate sample insights for demonstration
    // In production, this would call a professional diagnostic API
    const demoAnalysis = generateDemoInsights();

    return demoAnalysis;
  } catch (error) {
    console.error('Error generating demo insights:', error);
    throw new Error('Failed to generate comparison insights');
  }
}

/**
 * Generate demo insights for UI demonstration
 * Uses relative indicators instead of precise measurements
 */
function generateDemoInsights(): AnalysisResult {
  const indicators: ChangeIndicator[] = [
    {
      tooth_region: 'Upper Right Molar Area',
      region: { x: 15, y: 20, width: 8, height: 15 },
      change_level: 'moderate',
      description: 'Observable changes detected in this region',
      priority: 'attention',
    },
    {
      tooth_region: 'Upper Right Premolar Area',
      region: { x: 35, y: 22, width: 7, height: 12 },
      change_level: 'minimal',
      description: 'Minor variations noted, monitor at next visit',
      priority: 'review',
    },
    {
      tooth_region: 'Lower Left Incisor Area',
      region: { x: 65, y: 75, width: 8, height: 14 },
      change_level: 'moderate',
      description: 'Changes observed, professional measurement recommended',
      priority: 'attention',
    },
  ];

  // Calculate health score (0-10 scale)
  const healthScore = 6.5; // Sample score
  const scoreChange = -1.5; // Declining trend

  // Determine concern level based on indicators
  const urgentCount = indicators.filter(i => i.priority === 'urgent').length;
  const attentionCount = indicators.filter(i => i.priority === 'attention').length;
  const concernLevel = urgentCount > 0 ? 'high' : attentionCount > 1 ? 'medium' : 'low';

  return {
    id: `demo-analysis-${Date.now()}`,
    baseline_xray_id: 'baseline-id',
    current_xray_id: 'current-id',
    overall_summary: `Comparison analysis shows ${indicators.length} areas with observable changes. ` +
      `Overall bone health score is ${healthScore}/10, showing a declining trend. ` +
      `Professional measurement and examination recommended for precise assessment.`,
    health_score: healthScore,
    score_change: scoreChange,
    concern_level: concernLevel,
    indicators,
    discussion_points: [
      'Schedule detailed professional examination',
      'Discuss observed changes with your dentist',
      'Consider professional bone density measurement',
      'Review oral hygiene routine and techniques',
      'Ask about preventive care options',
    ],
    analysis_date: new Date().toISOString(),
    confidence: 'medium',
    is_demo_data: true, // CRITICAL: Always true for demo mode
  };
}

/**
 * FUTURE: Integration with professional diagnostic API
 * This would replace the demo function when connecting to real medical-grade analysis
 *
 * Requirements:
 * - FDA/CE approval for diagnostic use
 * - HIPAA compliance
 * - Professional calibration
 * - Licensed radiologist review
 */
export async function analyzWithProfessionalAPI(
  baselineImageUrl: string,
  currentImageUrl: string
): Promise<AnalysisResult> {
  // Placeholder for future professional API integration
  // Examples: Overjet API, Denti.AI, Pearl AI
  throw new Error('Professional API integration not yet implemented. This requires medical-grade diagnostic tools.');
}

/**
 * Educational helper: Explain what the system can and cannot do
 */
export const SYSTEM_CAPABILITIES = {
  canDo: [
    'Display X-ray images side-by-side',
    'Help track dental visits over time',
    'Provide visual comparison tools',
    'Generate discussion points for dentist visits',
    'Demonstrate UI/UX concepts',
  ],
  cannotDo: [
    'Provide medical diagnoses',
    'Measure bone loss with millimeter precision',
    'Replace professional dental examination',
    'Detect diseases or conditions',
    'Prescribe treatments',
  ],
  disclaimer: 'This is a demonstration application for UI/UX purposes. ' +
    'All analysis features use sample data and should NOT be used for medical decisions. ' +
    'Always consult a licensed dental professional for diagnosis and treatment.',
};
