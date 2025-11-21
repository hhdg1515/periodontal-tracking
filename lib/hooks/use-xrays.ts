import useSWR from 'swr';
import { xraysService } from '../supabase/xrays-service';

export function useXRays(visitId: string | null) {
  const {
    data: xrays,
    error,
    isLoading,
    mutate,
  } = useSWR(
    visitId ? `/api/xrays/visit/${visitId}` : null,
    () => visitId ? xraysService.getByVisitId(visitId) : null
  );

  return {
    xrays: xrays || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useXRay(id: string | null) {
  const {
    data: xray,
    error,
    isLoading,
  } = useSWR(
    id ? `/api/xrays/${id}` : null,
    () => id ? xraysService.getById(id) : null
  );

  return {
    xray,
    isLoading,
    isError: error,
  };
}

export function useXRaysForComparison(patientId: string | null) {
  const {
    data: xrays,
    error,
    isLoading,
  } = useSWR(
    patientId ? `/api/xrays/comparison/${patientId}` : null,
    () => patientId ? xraysService.getForComparison(patientId) : null
  );

  return {
    xrays: xrays || [],
    isLoading,
    isError: error,
  };
}
