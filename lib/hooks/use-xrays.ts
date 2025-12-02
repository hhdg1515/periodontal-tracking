import { useState, useEffect } from 'react';
import { DEMO_XRAYS, getDemoXRaysByVisitId } from '../demo/mock-data';

// Convert demo X-rays to expected format
const convertDemoXRay = (xray: any) => ({
  id: xray.id,
  visit_id: xray.visitId,
  image_url: xray.imageUrl,
  xray_type: xray.type === 'baseline' ? 'periapical' : 'bitewing_right',
  analysis_status: 'analyzed',
  uploaded_at: xray.uploadedAt.toISOString(),
  created_at: xray.uploadedAt.toISOString(),
});

export function useXRays(visitId: string | null) {
  const [xrays, setXRays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!visitId) {
      setXRays([]);
      return;
    }

    setIsLoading(true);
    // Get demo X-rays for this visit
    const demoXRays = getDemoXRaysByVisitId(visitId);
    const formattedXRays = demoXRays.map(convertDemoXRay);
    setXRays(formattedXRays);
    setIsLoading(false);
  }, [visitId]);

  const mutate = () => {
    if (visitId) {
      const demoXRays = getDemoXRaysByVisitId(visitId);
      const formattedXRays = demoXRays.map(convertDemoXRay);
      setXRays(formattedXRays);
    }
  };

  return {
    xrays,
    isLoading,
    isError,
    mutate,
  };
}

export function useXRay(id: string | null) {
  const [xray, setXRay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) {
      setXRay(null);
      return;
    }

    setIsLoading(true);
    const demoXRay = DEMO_XRAYS.find(x => x.id === id);
    if (demoXRay) {
      setXRay(convertDemoXRay(demoXRay));
    }
    setIsLoading(false);
  }, [id]);

  return {
    xray,
    isLoading,
    isError,
  };
}

export function useXRaysForComparison(patientId: string | null) {
  const [xrays, setXRays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!patientId) {
      setXRays([]);
      return;
    }

    setIsLoading(true);
    // Get all X-rays for this patient (from all visits)
    const allXRays = DEMO_XRAYS.map(convertDemoXRay);
    setXRays(allXRays);
    setIsLoading(false);
  }, [patientId]);

  return {
    xrays,
    isLoading,
    isError,
  };
}
