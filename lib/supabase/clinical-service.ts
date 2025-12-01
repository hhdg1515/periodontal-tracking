import { supabase } from './client';
import {
  ClinicalAssessment,
  ClinicalAssessmentInsert,
  TreatmentPlan,
  TreatmentPlanInsert,
  ClinicalFinding,
  ClinicalFindingInsert,
  AssessmentSummary,
} from '@/lib/types/clinical';

// =====================================================
// Clinical Assessment Service
// =====================================================

export const clinicalAssessmentService = {
  // Get assessment by visit ID
  async getByVisitId(visitId: string): Promise<ClinicalAssessment | null> {
    const { data, error } = await supabase
      .from('clinical_assessments')
      .select('*')
      .eq('visit_id', visitId)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    return data as ClinicalAssessment;
  },

  // Get all assessments for a patient (across visits)
  async getByPatientId(patientId: string): Promise<ClinicalAssessment[]> {
    const { data, error } = await supabase
      .from('clinical_assessments')
      .select(`
        *,
        visit:visits!inner (
          patient_id,
          visit_date
        )
      `)
      .eq('visit.patient_id', patientId)
      .order('assessment_date', { ascending: false });

    if (error) throw error;
    return data as ClinicalAssessment[];
  },

  // Create new assessment
  async create(assessment: ClinicalAssessmentInsert): Promise<ClinicalAssessment> {
    const { data, error } = await supabase
      .from('clinical_assessments')
      .insert(assessment)
      .select()
      .single();

    if (error) throw error;
    return data as ClinicalAssessment;
  },

  // Update existing assessment
  async update(id: string, updates: Partial<ClinicalAssessmentInsert>): Promise<ClinicalAssessment> {
    const { data, error } = await supabase
      .from('clinical_assessments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ClinicalAssessment;
  },

  // Delete assessment
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clinical_assessments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Generate assessment summary
  generateSummary(assessment: ClinicalAssessment): AssessmentSummary {
    const symptomCount = [
      assessment.spontaneous_pain,
      assessment.palpation_tenderness,
      assessment.swelling,
      assessment.sinus_tract,
    ].filter(Boolean).length;

    const testsPerformed = [
      assessment.pulp_vitality_cold !== 'not_tested',
      assessment.pulp_vitality_electric !== 'not_tested',
      assessment.percussion_test !== 'not_tested',
      assessment.mobility_grade !== 'not_tested',
    ].filter(Boolean).length;

    // Determine concern level
    let concernLevel: 'low' | 'medium' | 'high' = 'low';

    if (
      assessment.endo_concern === 'confirmed' ||
      assessment.combined_lesion ||
      symptomCount >= 3
    ) {
      concernLevel = 'high';
    } else if (
      assessment.endo_concern === 'suspected' ||
      assessment.perio_status === 'severe' ||
      symptomCount >= 2
    ) {
      concernLevel = 'medium';
    }

    return {
      hasSymptoms: symptomCount > 0,
      symptomCount,
      testsPerformed,
      concernLevel,
      needsEndoEvaluation: assessment.requires_endo_evaluation,
      needsPerioTreatment: assessment.requires_perio_treatment,
      needsReferral: assessment.requires_specialist_referral,
    };
  },
};

// =====================================================
// Treatment Plan Service
// =====================================================

export const treatmentPlanService = {
  // Get treatment plan by assessment ID
  async getByAssessmentId(assessmentId: string): Promise<TreatmentPlan | null> {
    const { data, error } = await supabase
      .from('treatment_plans')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as TreatmentPlan;
  },

  // Create treatment plan
  async create(plan: TreatmentPlanInsert): Promise<TreatmentPlan> {
    const { data, error } = await supabase
      .from('treatment_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data as TreatmentPlan;
  },

  // Update treatment plan
  async update(id: string, updates: Partial<TreatmentPlanInsert>): Promise<TreatmentPlan> {
    const { data, error } = await supabase
      .from('treatment_plans')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TreatmentPlan;
  },

  // Update status
  async updateStatus(id: string, status: TreatmentPlan['status']): Promise<void> {
    const { error } = await supabase
      .from('treatment_plans')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// Clinical Findings Service
// =====================================================

export const clinicalFindingsService = {
  // Get all findings for an assessment
  async getByAssessmentId(assessmentId: string): Promise<ClinicalFinding[]> {
    const { data, error } = await supabase
      .from('clinical_findings')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ClinicalFinding[];
  },

  // Create finding
  async create(finding: ClinicalFindingInsert): Promise<ClinicalFinding> {
    const { data, error } = await supabase
      .from('clinical_findings')
      .insert(finding)
      .select()
      .single();

    if (error) throw error;
    return data as ClinicalFinding;
  },

  // Create multiple findings
  async createMultiple(findings: ClinicalFindingInsert[]): Promise<ClinicalFinding[]> {
    const { data, error } = await supabase
      .from('clinical_findings')
      .insert(findings)
      .select();

    if (error) throw error;
    return data as ClinicalFinding[];
  },

  // Delete finding
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clinical_findings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
