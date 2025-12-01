import { ClinicalGuideline } from '@/lib/types/clinical';

// =====================================================
// Clinical Guidelines Database
// Based on AAE, AAP, and other professional guidelines
// =====================================================

export const CLINICAL_GUIDELINES: ClinicalGuideline[] = [
  // Perio-Endo Lesions
  {
    id: 'perio-endo-1',
    title: 'Primary Endodontic Lesion with Secondary Periodontal Involvement',
    category: 'perio_endo',
    condition: 'Non-vital tooth with apical radiolucency AND deep periodontal pocket',
    criteria: [
      'Negative pulp vitality test',
      'Periapical radiolucency visible on X-ray',
      'Probing depth ≥ 6mm extending to apex',
      'History of endodontic symptoms before periodontal symptoms',
    ],
    recommendations: [
      'Complete endodontic treatment first',
      'Re-evaluate periodontal status 2-3 months after endodontic treatment',
      'If pocket persists, consider periodontal therapy',
      'Monitor healing with radiographs',
    ],
    treatment_sequence: [
      '1. Root canal treatment',
      '2. Wait 2-3 months for healing',
      '3. Re-assess pocket depth',
      '4. Periodontal treatment if needed',
    ],
    source: 'AAE Clinical Guidelines',
    reference_url: 'https://www.aae.org/specialty/clinical-resources/guidelines-position-statements/',
  },

  {
    id: 'perio-endo-2',
    title: 'Primary Periodontal Lesion Affecting Pulp',
    category: 'perio_endo',
    condition: 'Advanced periodontal disease causing pulpal necrosis',
    criteria: [
      'Generalized periodontal disease',
      'Deep pocket progressing toward apex',
      'May have negative or sluggish vitality response',
      'History of periodontal symptoms before endodontic symptoms',
    ],
    recommendations: [
      'Periodontal treatment first',
      'Evaluate pulp vitality after periodontal therapy',
      'Endodontic treatment only if pulp becomes necrotic',
      'Prognosis depends on periodontal support remaining',
    ],
    treatment_sequence: [
      '1. Scaling and root planing',
      '2. Re-evaluate pulp vitality',
      '3. Endodontic treatment if pulp necrosis confirmed',
      '4. Continue periodontal maintenance',
    ],
    source: 'AAE Clinical Guidelines',
  },

  {
    id: 'perio-endo-3',
    title: 'True Combined Lesion',
    category: 'perio_endo',
    condition: 'Simultaneous endodontic and periodontal pathology',
    criteria: [
      'Non-vital tooth',
      'Periapical pathology',
      'Deep generalized periodontal pockets',
      'Both pathologies exist independently',
    ],
    recommendations: [
      'Endodontic treatment first to eliminate pulpal infection',
      'Delay periodontal surgery until endodontic healing verified',
      'Comprehensive periodontal therapy after endo healing',
      'Guarded prognosis - may require extraction',
    ],
    treatment_sequence: [
      '1. Complete root canal treatment',
      '2. Wait 3-6 months for periapical healing',
      '3. Periodontal therapy (scaling, surgery if needed)',
      '4. Long-term monitoring',
    ],
    source: 'AAE & AAP Joint Guidelines',
  },

  // Endodontic Evaluation Indicators
  {
    id: 'endo-eval-1',
    title: 'Indications for Endodontic Evaluation',
    category: 'endo',
    condition: 'When to suspect endodontic pathology',
    criteria: [
      'Spontaneous pain (especially at night)',
      'Prolonged sensitivity to hot/cold',
      'Pain on biting or percussion',
      'Negative response to vitality tests',
      'Periapical radiolucency on radiograph',
      'Sinus tract or abscess',
      'Previous trauma to tooth',
    ],
    recommendations: [
      'Perform comprehensive pulp vitality testing',
      'Cold test with refrigerant or ice',
      'Electric pulp testing for confirmation',
      'Percussion and palpation testing',
      'Periapical radiograph at different angles',
    ],
    source: 'AAE Diagnostic Guidelines',
  },

  {
    id: 'endo-eval-2',
    title: 'Root Canal Treatment Indicators',
    category: 'endo',
    condition: 'When root canal treatment is indicated',
    criteria: [
      'Irreversible pulpitis (prolonged pain to thermal stimuli)',
      'Pulp necrosis (negative vitality test)',
      'Symptomatic apical periodontitis',
      'Chronic apical abscess',
      'Tooth requiring crown with questionable pulp health',
    ],
    recommendations: [
      'Refer to endodontist if complex anatomy',
      'Consider referral for calcified canals',
      'Evaluate tooth restorability before treatment',
      'Discuss prognosis and alternatives with patient',
    ],
    source: 'AAE Treatment Guidelines',
  },

  // Periodontal Evaluation
  {
    id: 'perio-eval-1',
    title: 'Periodontal Disease Severity Classification',
    category: 'perio',
    condition: 'Staging periodontal disease',
    criteria: [
      'Stage I (Initial): Probing depth ≤4mm, attachment loss 1-2mm',
      'Stage II (Moderate): Probing depth ≤5mm, attachment loss 3-4mm',
      'Stage III (Severe): Probing depth ≥6mm, attachment loss ≥5mm',
      'Stage IV (Advanced): Tooth loss ≥5 teeth, severe attachment loss',
    ],
    recommendations: [
      'Stage I-II: Scaling and root planing, improved oral hygiene',
      'Stage III: Consider surgical therapy, possible specialist referral',
      'Stage IV: Specialist referral recommended, complex treatment planning',
    ],
    source: 'AAP Classification System 2017',
    reference_url: 'https://www.perio.org/consumer/new-classification',
  },

  {
    id: 'perio-eval-2',
    title: 'Furcation Involvement Management',
    category: 'perio',
    condition: 'Bone loss in multi-rooted teeth furcation areas',
    criteria: [
      'Grade I: Horizontal probing <3mm into furcation',
      'Grade II: Horizontal probing >3mm but not through-and-through',
      'Grade III: Through-and-through probing',
    ],
    recommendations: [
      'Grade I: Scaling and root planing, monitor',
      'Grade II: Consider surgical therapy, possible tunneling',
      'Grade III: Root amputation, hemisection, or extraction',
      'All grades: Improve oral hygiene in area',
    ],
    source: 'AAP Furcation Guidelines',
  },

  // General Clinical Decision Making
  {
    id: 'general-1',
    title: 'Acute vs Chronic Assessment',
    category: 'general',
    condition: 'Determining urgency of treatment',
    criteria: [
      'Acute: Severe pain, swelling, fever, rapid onset',
      'Chronic: Mild/no pain, slow progression, may have sinus tract',
    ],
    recommendations: [
      'Acute: Address immediately, drainage if needed, pain management',
      'Chronic: Can schedule elective treatment, monitor',
      'Both: Identify and address cause',
    ],
    source: 'Clinical Best Practices',
  },

  {
    id: 'general-2',
    title: 'Referral Decision Making',
    category: 'general',
    condition: 'When to refer to specialist',
    criteria: [
      'Complex anatomy (calcified canals, multiple canals)',
      'Previous treatment failure',
      'Open apex (requires apexification)',
      'Suspected vertical root fracture',
      'Severe periodontal-endodontic lesion',
      'Patient preference for specialist care',
    ],
    recommendations: [
      'Discuss referral options with patient',
      'Provide relevant radiographs and clinical notes',
      'Continue supportive care until specialist appointment',
      'Follow up on referral outcome',
    ],
    source: 'ADA Referral Guidelines',
  },
];

// =====================================================
// Helper Functions
// =====================================================

/**
 * Get relevant guidelines based on clinical findings
 */
export function getRelevantGuidelines(assessment: {
  endo_concern?: string | null;
  perio_status?: string | null;
  combined_lesion?: boolean;
  requires_specialist_referral?: boolean;
}): ClinicalGuideline[] {
  const relevant: ClinicalGuideline[] = [];

  // Combined lesions
  if (assessment.combined_lesion) {
    relevant.push(...CLINICAL_GUIDELINES.filter(g => g.category === 'perio_endo'));
  }

  // Endodontic concerns
  if (assessment.endo_concern === 'suspected' || assessment.endo_concern === 'confirmed') {
    relevant.push(...CLINICAL_GUIDELINES.filter(g => g.category === 'endo'));
  }

  // Periodontal disease
  if (assessment.perio_status === 'moderate' || assessment.perio_status === 'severe') {
    relevant.push(...CLINICAL_GUIDELINES.filter(g => g.category === 'perio'));
  }

  // Referral considerations
  if (assessment.requires_specialist_referral) {
    relevant.push(...CLINICAL_GUIDELINES.filter(g => g.id === 'general-2'));
  }

  // If no specific guidelines, show general
  if (relevant.length === 0) {
    relevant.push(...CLINICAL_GUIDELINES.filter(g => g.category === 'general'));
  }

  return relevant;
}

/**
 * Get checklist items based on guideline criteria
 */
export function getChecklistFromGuideline(guideline: ClinicalGuideline): Array<{ text: string; completed: boolean }> {
  return guideline.criteria.map(criterion => ({
    text: criterion,
    completed: false,
  }));
}
