import useSWR from 'swr';
import { xraysService } from '@/lib/supabase/xrays-service';
import { XRay } from '@/lib/types';

/**
 * Hook to fetch all X-rays for a patient, grouped by visit
 * Used for the comparison page
 */
export function useXRaysForComparison(patientId: string | null) {
  const {
    data: xrays,
    error,
    isLoading,
    mutate,
  } = useSWR<XRay[]>(
    patientId ? [`/api/xrays/patient`, patientId] : null,
    async () => {
      if (!patientId) return [];
      return await xraysService.getByPatientId(patientId);
    }
  );

  return {
    xrays: xrays || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a specific X-ray by ID
 */
export function useXRay(xrayId: string | null) {
  const {
    data: xray,
    error,
    isLoading,
  } = useSWR<XRay>(
    xrayId ? [`/api/xray`, xrayId] : null,
    async () => {
      if (!xrayId) return null;
      return await xraysService.getById(xrayId);
    }
  );

  return {
    xray: xray || null,
    isLoading,
    isError: error,
  };
}
