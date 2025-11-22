"use client";

import useSWR from 'swr';
import { clinicalAssessmentService } from '@/lib/supabase/clinical-service';
import { ClinicalAssessment } from '@/lib/types/clinical';

/**
 * Hook to fetch clinical assessment for a specific visit
 */
export function useClinicalAssessment(visitId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ClinicalAssessment | null>(
    visitId ? [`/clinical-assessment`, visitId] : null,
    async () => {
      if (!visitId) return null;
      return await clinicalAssessmentService.getByVisitId(visitId);
    }
  );

  return {
    assessment: data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to create or update clinical assessment
 */
export function useClinicalAssessmentMutations() {
  const createAssessment = async (assessmentData: any) => {
    return await clinicalAssessmentService.create(assessmentData);
  };

  const updateAssessment = async (id: string, updates: any) => {
    return await clinicalAssessmentService.update(id, updates);
  };

  return {
    createAssessment,
    updateAssessment,
  };
}
