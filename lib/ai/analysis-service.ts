import Anthropic from '@anthropic-ai/sdk';
import type { SupportedLanguage } from "../i18n/translations";

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
  currentImageUrl: string,
  language: SupportedLanguage = "en"
): Promise<AnalysisResult> {
  try {
    // DEMO MODE: Generate sample insights for demonstration
    // In production, this would call a professional diagnostic API
    const demoAnalysis = generateDemoInsights(language);

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
type IndicatorTemplateKey = 'upperRightMolar' | 'upperRightPremolar' | 'lowerLeftIncisor';

interface IndicatorTemplate {
  key: IndicatorTemplateKey;
  region: { x: number; y: number; width: number; height: number };
  change_level: ChangeIndicator['change_level'];
  priority: ChangeIndicator['priority'];
}

const INDICATOR_TEMPLATES: IndicatorTemplate[] = [
  {
    key: 'upperRightMolar',
    region: { x: 15, y: 20, width: 8, height: 15 },
    change_level: 'moderate',
    priority: 'attention',
  },
  {
    key: 'upperRightPremolar',
    region: { x: 35, y: 22, width: 7, height: 12 },
    change_level: 'minimal',
    priority: 'review',
  },
  {
    key: 'lowerLeftIncisor',
    region: { x: 65, y: 75, width: 8, height: 14 },
    change_level: 'moderate',
    priority: 'attention',
  },
];

const INDICATOR_TEXT: Record<SupportedLanguage, Record<IndicatorTemplateKey, { region: string; description: string }>> = {
  en: {
    upperRightMolar: {
      region: 'Upper Right Molar Area',
      description: 'Observable changes detected in this region',
    },
    upperRightPremolar: {
      region: 'Upper Right Premolar Area',
      description: 'Minor variations noted, monitor at next visit',
    },
    lowerLeftIncisor: {
      region: 'Lower Left Incisor Area',
      description: 'Changes observed, professional measurement recommended',
    },
  },
  zh: {
    upperRightMolar: {
      region: '右上臼齿区域',
      description: '该区域可见变化，需要密切追踪',
    },
    upperRightPremolar: {
      region: '右上前臼齿区域',
      description: '出现轻微差异，建议下次回诊再确认',
    },
    lowerLeftIncisor: {
      region: '左下门齿区域',
      description: '侦测到变化，建议安排专业量测',
    },
  },
};

const SUMMARY_TEXT: Record<SupportedLanguage, string> = {
  en: "Comparison analysis shows {count} areas with observable changes. Overall bone health score is {score}/10, showing a declining trend. Professional measurement and examination recommended for precise assessment.",
  zh: "本次对比显示 {count} 个区域出现变化，整体骨骼健康评分为 {score}/10，呈现略微下降趋势。建议安排专业量测与检查，以取得更精确的评估。",
};

const DISCUSSION_POINTS: Record<SupportedLanguage, string[]> = {
  en: [
    'Schedule detailed professional examination',
    'Discuss observed changes with your dentist',
    'Consider professional bone density measurement',
    'Review oral hygiene routine and techniques',
    'Ask about preventive care options',
  ],
  zh: [
    '安排详细的专业检查',
    '与牙医讨论已观察到的变化',
    '评估是否需要专业骨密度量测',
    '检视口腔清洁方式与习惯',
    '询问预防性治疗方案',
  ],
};

function buildIndicators(language: SupportedLanguage): ChangeIndicator[] {
  const text = INDICATOR_TEXT[language] || INDICATOR_TEXT.en;
  return INDICATOR_TEMPLATES.map(template => ({
    tooth_region: text[template.key].region,
    region: template.region,
    change_level: template.change_level,
    description: text[template.key].description,
    priority: template.priority,
  }));
}

function formatSummary(language: SupportedLanguage, count: number, score: number) {
  const template = SUMMARY_TEXT[language] || SUMMARY_TEXT.en;
  return template
    .replace('{count}', String(count))
    .replace('{score}', score.toFixed(1));
}

function generateDemoInsights(language: SupportedLanguage): AnalysisResult {
  const indicators = buildIndicators(language);

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
    overall_summary: formatSummary(language, indicators.length, healthScore),
    health_score: healthScore,
    score_change: scoreChange,
    concern_level: concernLevel,
    indicators,
    discussion_points: [...(DISCUSSION_POINTS[language] || DISCUSSION_POINTS.en)],
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
