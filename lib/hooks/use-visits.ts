import useSWR from 'swr';
import { visitsService } from '../supabase/visits-service';

export function useVisits(patientId: string | null) {
  const {
    data: visits,
    error,
    isLoading,
    mutate,
  } = useSWR(
    patientId ? `/api/visits/patient/${patientId}` : null,
    () => patientId ? visitsService.getByPatientId(patientId) : null
  );

  return {
    visits: visits || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useVisit(id: string | null) {
  const {
    data: visit,
    error,
    isLoading,
    mutate,
  } = useSWR(
    id ? `/api/visits/${id}` : null,
    () => id ? visitsService.getById(id) : null
  );

  return {
    visit,
    isLoading,
    isError: error,
    mutate,
  };
}
