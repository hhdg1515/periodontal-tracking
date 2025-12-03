// =====================================================
// Clinical Assessment Types
// =====================================================

export type ThermalSensitivity = 'none' | 'mild' | 'severe';
export type PercussionSensitivity = 'none' | 'mild' | 'severe';
export type VitalityTestResult = 'positive' | 'negative' | 'delayed' | 'not_tested';
export type PercussionTestResult = 'normal' | 'sensitive' | 'painful' | 'not_tested';
export type MobilityGrade = 'normal' | 'grade_1' | 'grade_2' | 'grade_3' | 'not_tested';
export type FurcationInvolvement = 'none' | 'grade_1' | 'grade_2' | 'grade_3' | 'not_assessed';
export type PerioStatus = 'healthy' | 'gingivitis' | 'mild' | 'moderate' | 'severe';
export type EndoConcern = 'none' | 'suspected' | 'confirmed';
export type ReferralSpecialty = 'endodontist' | 'periodontist' | 'oral_surgeon';
export type TreatmentStatus = 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type FindingSeverity = 'mild' | 'moderate' | 'severe';

// Clinical Assessment Record
export interface ClinicalAssessment {
  id: string;
  visit_id: string;
  assessment_date: string;

  // Symptoms
  spontaneous_pain: boolean;
  thermal_sensitivity: ThermalSensitivity | null;
  percussion_sensitivity: PercussionSensitivity | null;
  palpation_tenderness: boolean;
  swelling: boolean;
  sinus_tract: boolean;

  // Clinical tests
  pulp_vitality_cold: VitalityTestResult;
  pulp_vitality_electric: VitalityTestResult;
  percussion_test: PercussionTestResult;
  mobility_grade: MobilityGrade;

  // Periodontal measurements
  pocket_depth_max: number | null;
  attachment_loss_max: number | null;
  bleeding_on_probing: boolean;
  furcation_involvement: FurcationInvolvement;

  // Clinical impression
  perio_status: PerioStatus | null;
  endo_concern: EndoConcern | null;
  combined_lesion: boolean;

  // Follow-up needs
  requires_endo_evaluation: boolean;
  requires_perio_treatment: boolean;
  requires_specialist_referral: boolean;
  referral_specialty: ReferralSpecialty | null;

  // Notes
  clinical_notes: string | null;
  differential_diagnosis: string | null;

  // Metadata
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Insert type (for creating new assessments)
export type ClinicalAssessmentInsert = Omit<ClinicalAssessment, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// Treatment Plan
export interface TreatmentPlan {
  id: string;
  assessment_id: string;

  immediate_treatment: string | null;
  pain_management: string | null;
  antibiotics_prescribed: boolean;

  planned_procedures: string[] | null;
  estimated_duration: string | null;

  follow_up_weeks: number | null;
  follow_up_notes: string | null;

  status: TreatmentStatus;

  created_at: string;
  updated_at: string;
}

export type TreatmentPlanInsert = Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// Clinical Finding
export interface ClinicalFinding {
  id: string;
  assessment_id: string;

  tooth_number: string | null;
  tooth_region: string | null;

  finding_type: string;
  description: string;
  severity: FindingSeverity;

  requires_attention: boolean;
  suggested_tests: string[] | null;

  created_at: string;
}

export type ClinicalFindingInsert = Omit<ClinicalFinding, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

// =====================================================
// Clinical Guidelines and References
// =====================================================

export interface ClinicalGuideline {
  id: string;
  title: string;
  category: 'perio' | 'endo' | 'perio_endo' | 'general';
  condition: string;
  criteria: string[];
  recommendations: string[];
  treatment_sequence?: string[];
  source: string; // AAE, AAP, etc.
  reference_url?: string;
}

// =====================================================
// Helper Types for UI Components
// =====================================================

export interface SymptomChecklistItem {
  key: keyof Pick<ClinicalAssessment,
    'spontaneous_pain' | 'palpation_tenderness' | 'swelling' | 'sinus_tract' | 'bleeding_on_probing'>;
  label: string;
  description?: string;
}

export interface TestItem {
  key: keyof Pick<ClinicalAssessment,
    'pulp_vitality_cold' | 'pulp_vitality_electric' | 'percussion_test' | 'mobility_grade'>;
  label: string;
  description: string;
  options: Array<{
    value: string;
    label: string;
    color?: string;
  }>;
}

export interface MeasurementItem {
  key: keyof Pick<ClinicalAssessment, 'pocket_depth_max' | 'attachment_loss_max'>;
  label: string;
  unit: string;
  normalRange: string;
  concernThreshold: number;
}

// =====================================================
// Assessment Summary (for display)
// =====================================================

export interface AssessmentSummary {
  hasSymptoms: boolean;
  symptomCount: number;
  testsPerformed: number;
  concernLevel: 'low' | 'medium' | 'high';
  needsEndoEvaluation: boolean;
  needsPerioTreatment: boolean;
  needsReferral: boolean;
}
