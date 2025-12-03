import useSWR from 'swr';
import { patientsService } from '../supabase/patients-service';

// For now, using a hardcoded clinic ID for MVP
// In production, this would come from authentication context
const DEMO_CLINIC_ID = 'demo-clinic-id';

export function usePatients() {
  const {
    data: patients,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [`/api/patients`, DEMO_CLINIC_ID],
    () => patientsService.getAll(DEMO_CLINIC_ID)
  );

  return {
    patients: patients || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePatient(id: string | null) {
  const {
    data: patient,
    error,
    isLoading,
    mutate,
  } = useSWR(
    id ? `/api/patients/${id}` : null,
    () => id ? patientsService.getById(id) : null
  );

  return {
    patient,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePatientSearch(query: string) {
  const {
    data: patients,
    error,
    isLoading,
  } = useSWR(
    query ? [`/api/patients/search`, DEMO_CLINIC_ID, query] : null,
    () => query ? patientsService.search(DEMO_CLINIC_ID, query) : []
  );

  return {
    patients: patients || [],
    isLoading,
    isError: error,
  };
}

// Export the clinic ID for use in components
export { DEMO_CLINIC_ID };
