import { useState, useEffect } from 'react';
import { DEMO_VISITS, getDemoVisitsByPatientId, getDemoXRaysByVisitId } from '../demo/mock-data';

// Convert demo visits to expected format
const convertDemoVisit = (visit: any) => {
  const xrays = getDemoXRaysByVisitId(visit.id).map((xray) => ({
    id: xray.id,
    image_url: xray.imageUrl,
    file_url: xray.imageUrl,
    xray_type: xray.type,
    uploaded_at: xray.uploadedAt.toISOString(),
  }));

  return {
    id: visit.id,
    patient_id: visit.patientId,
    visit_date: visit.visitDate.toISOString().split('T')[0],
    visit_type: 'followup', // Default type
    notes: visit.notes,
    created_at: visit.visitDate.toISOString(),
    xrays,
    analysis_results: xrays.length > 0 ? [{ id: `${visit.id}-analysis` }] : [],
  };
};

export function useVisits(patientId: string | null) {
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setVisits([]);
      return;
    }

    setIsLoading(true);
    // Get demo visits for this patient
    const demoVisits = getDemoVisitsByPatientId(patientId);
    const formattedVisits = demoVisits.map(convertDemoVisit);
    setVisits(formattedVisits);
    setIsLoading(false);
  }, [patientId]);

  const mutate = () => {
    if (patientId) {
      const demoVisits = getDemoVisitsByPatientId(patientId);
      const formattedVisits = demoVisits.map(convertDemoVisit);
      setVisits(formattedVisits);
    }
  };

  return {
    visits,
    isLoading,
    isError,
    mutate,
  };
}

export function useVisit(id: string | null) {
  const [visit, setVisit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) {
      setVisit(null);
      return;
    }

    setIsLoading(true);
    // Find the visit in demo data
    const demoVisit = DEMO_VISITS.find(v => v.id === id);
    if (demoVisit) {
      setVisit(convertDemoVisit(demoVisit));
    }
    setIsLoading(false);
  }, [id]);

  const mutate = () => {
    if (id) {
      const demoVisit = DEMO_VISITS.find(v => v.id === id);
      if (demoVisit) {
        setVisit(convertDemoVisit(demoVisit));
      }
    }
  };

  return {
    visit,
    isLoading,
    isError,
    mutate,
  };
}
