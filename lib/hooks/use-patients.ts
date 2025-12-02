import { useState, useEffect } from 'react';
import { DEMO_PATIENTS } from '../demo/mock-data';

// For now, using a hardcoded clinic ID for MVP
// In production, this would come from authentication context
const DEMO_CLINIC_ID = 'demo-clinic-id';

// Convert mock patient data to the expected format
const basePatients = DEMO_PATIENTS.map(patient => ({
  id: patient.id,
  patient_id: patient.id,
  first_name: patient.firstName,
  last_name: patient.lastName,
  date_of_birth: patient.dateOfBirth,
  email: patient.email,
  phone: patient.phone,
  is_smoker: patient.isSmoker,
  has_diabetes: patient.hasDiabetes,
  clinic_id: DEMO_CLINIC_ID,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

// Load persisted patients from localStorage and merge with base patients
const getPersistedPatients = () => {
  if (typeof window === 'undefined') return basePatients;

  try {
    const storedJson = localStorage.getItem('mock_patients');
    const stored = storedJson ? JSON.parse(storedJson) : [];
    return [...basePatients, ...stored];
  } catch {
    return basePatients;
  }
};

const mockPatients = getPersistedPatients();

export function usePatients() {
  const [patients, setPatients] = useState(mockPatients);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const mutate = () => {
    // Reload from localStorage to get newly added patients
    const updatedPatients = getPersistedPatients();
    setPatients(updatedPatients);
  };

  return {
    patients,
    isLoading,
    isError,
    mutate,
  };
}

export function usePatient(id: string | null) {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (!id) {
      setPatient(null);
      return;
    }

    setIsLoading(true);
    // Get current patients including persisted ones
    const allPatients = getPersistedPatients();
    const foundPatient = allPatients.find(p => p.id === id);
    setPatient(foundPatient || null);
    setIsLoading(false);
  }, [id]);

  const mutate = () => {
    if (id) {
      const allPatients = getPersistedPatients();
      const foundPatient = allPatients.find(p => p.id === id);
      setPatient(foundPatient || null);
    }
  };

  return {
    patient,
    isLoading,
    isError,
    mutate,
  };
}

export function usePatientSearch(query: string) {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (!query) {
      setPatients([]);
      return;
    }

    setIsLoading(true);
    const lowerQuery = query.toLowerCase();
    const allPatients = getPersistedPatients();
    const filtered = allPatients.filter(p =>
      p.first_name.toLowerCase().includes(lowerQuery) ||
      p.last_name.toLowerCase().includes(lowerQuery) ||
      p.patient_id.toLowerCase().includes(lowerQuery)
    );
    setPatients(filtered);
    setIsLoading(false);
  }, [query]);

  return {
    patients,
    isLoading,
    isError,
  };
}

// Export the clinic ID for use in components
export { DEMO_CLINIC_ID };
