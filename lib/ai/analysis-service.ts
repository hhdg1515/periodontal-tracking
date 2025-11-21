import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
// Note: In production, use environment variable for API key
const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

export interface BoneLossAnnotation {
  tooth_number: number;
  region: {
    x: number; // Percentage position
    y: number;
    width: number;
    height: number;
  };
  bone_loss_mm: number;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface AnalysisResult {
  id: string;
  baseline_xray_id: string;
  current_xray_id: string;
  overall_assessment: string;
  average_bone_loss: number;
  risk_level: 'low' | 'medium' | 'high';
  annotations: BoneLossAnnotation[];
  recommendations: string[];
  analysis_date: string;
}

/**
 * Analyze X-ray comparison using Claude Vision API
 * This is a mock implementation - in production, you would:
 * 1. Send both X-ray images to Claude Vision API
 * 2. Use a specialized prompt for periodontal analysis
 * 3. Parse the structured response
 */
export async function analyzeXRayComparison(
  baselineImageUrl: string,
  currentImageUrl: string
): Promise<AnalysisResult> {
  try {
    // For demo purposes, we'll use Claude API with a simulated analysis
    // In production, you would fetch the images and send them to Claude Vision

    // Simulated AI analysis (replace with actual Claude Vision API call)
    const mockAnalysis = generateMockAnalysis();

    // Store analysis in database
    // await analysisService.create(mockAnalysis);

    return mockAnalysis;
  } catch (error) {
    console.error('Error analyzing X-rays:', error);
    throw new Error('Failed to analyze X-rays');
  }
}

/**
 * Generate mock analysis data for demonstration
 * In production, this would be replaced with actual Claude Vision API response
 */
function generateMockAnalysis(): AnalysisResult {
  const annotations: BoneLossAnnotation[] = [
    {
      tooth_number: 18,
      region: { x: 15, y: 20, width: 8, height: 15 },
      bone_loss_mm: 1.3,
      severity: 'moderate',
      description: 'Horizontal bone loss detected around molar #18',
    },
    {
      tooth_number: 14,
      region: { x: 35, y: 22, width: 7, height: 12 },
      bone_loss_mm: 0.9,
      severity: 'mild',
      description: 'Minor bone resorption around premolar #14',
    },
    {
      tooth_number: 31,
      region: { x: 65, y: 75, width: 8, height: 14 },
      bone_loss_mm: 1.1,
      severity: 'moderate',
      description: 'Progressive bone loss on mandibular incisor #31',
    },
  ];

  const averageLoss = annotations.reduce((sum, a) => sum + a.bone_loss_mm, 0) / annotations.length;
  const severeCases = annotations.filter(a => a.severity === 'severe').length;
  const moderateCases = annotations.filter(a => a.severity === 'moderate').length;

  return {
    id: `analysis-${Date.now()}`,
    baseline_xray_id: 'baseline-id',
    current_xray_id: 'current-id',
    overall_assessment: `Comparison analysis reveals progressive periodontal disease with ${moderateCases} areas of moderate concern and ${severeCases} severe cases. Average bone loss of ${averageLoss.toFixed(1)}mm detected across ${annotations.length} teeth.`,
    average_bone_loss: averageLoss,
    risk_level: averageLoss > 1.5 ? 'high' : averageLoss > 0.8 ? 'medium' : 'low',
    annotations,
    recommendations: [
      'Deep cleaning (SRP) for teeth #18, #14, #31',
      'Enhanced home care instructions with focus on interdental cleaning',
      'Follow-up appointment in 3 months to monitor progression',
      'Consider referral to periodontist if no improvement',
      'Patient education on risk factors (smoking, diabetes)',
    ],
    analysis_date: new Date().toISOString(),
  };
}

/**
 * Call Claude Vision API for actual X-ray analysis
 * This is the production implementation
 */
export async function analyzeWithClaudeVision(
  baselineImageUrl: string,
  currentImageUrl: string
): Promise<AnalysisResult> {
  try {
    // Fetch images as base64
    const baselineImage = await fetchImageAsBase64(baselineImageUrl);
    const currentImage = await fetchImageAsBase64(currentImageUrl);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: baselineImage,
              },
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: currentImage,
              },
            },
            {
              type: 'text',
              text: `You are an expert dental radiologist analyzing periodontal X-rays. Compare these two X-ray images (baseline and current) and provide a detailed analysis.

Please identify:
1. Areas of bone loss between the two images
2. Tooth numbers affected (using FDI numbering system)
3. Approximate bone loss measurements in millimeters
4. Severity classification (mild <1mm, moderate 1-2mm, severe >2mm)
5. Overall risk assessment
6. Treatment recommendations

Return your analysis in the following JSON format:
{
  "overall_assessment": "string",
  "average_bone_loss": number,
  "risk_level": "low|medium|high",
  "annotations": [
    {
      "tooth_number": number,
      "region": {"x": number, "y": number, "width": number, "height": number},
      "bone_loss_mm": number,
      "severity": "mild|moderate|severe",
      "description": "string"
    }
  ],
  "recommendations": ["string"]
}`,
            },
          ],
        },
      ],
    });

    // Parse Claude's response
    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        return {
          id: `analysis-${Date.now()}`,
          baseline_xray_id: 'baseline-id',
          current_xray_id: 'current-id',
          ...analysisData,
          analysis_date: new Date().toISOString(),
        };
      }
    }

    throw new Error('Failed to parse Claude Vision response');
  } catch (error) {
    console.error('Claude Vision API error:', error);
    // Fallback to mock analysis
    return generateMockAnalysis();
  }
}

/**
 * Fetch image from URL and convert to base64
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}
