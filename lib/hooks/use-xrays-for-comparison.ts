import { useState, useEffect } from 'react';
import { DEMO_XRAYS } from '../demo/mock-data';

// Convert demo X-rays to expected format
const convertDemoXRay = (xray: any) => ({
  id: xray.id,
  visit_id: xray.visitId,
  image_url: xray.imageUrl,
  file_url: xray.imageUrl, // Keep for backwards compatibility
  xray_type: xray.type, // Use actual anatomical type from demo data
  analysis_status: 'analyzed',
  uploaded_at: xray.uploadedAt.toISOString(),
  upload_date: xray.uploadedAt.toISOString(), // Keep for backwards compatibility
  created_at: xray.uploadedAt.toISOString(),
});

/**
 * Hook to fetch all X-rays for a patient, grouped by visit
 * Used for the comparison page
 */
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
    // For now, return all demo X-rays
    // In production, filter by patientId
    const allXRays = DEMO_XRAYS.map(convertDemoXRay);
    setXRays(allXRays);
    setIsLoading(false);
  }, [patientId]);

  const mutate = () => {
    if (patientId) {
      const allXRays = DEMO_XRAYS.map(convertDemoXRay);
      setXRays(allXRays);
    }
  };

  return {
    xrays,
    isLoading,
    isError,
    mutate,
  };
}

/**
 * Hook to fetch a specific X-ray by ID
 */
export function useXRay(xrayId: string | null) {
  const [xray, setXRay] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!xrayId) {
      setXRay(null);
      return;
    }

    setIsLoading(true);
    const demoXRay = DEMO_XRAYS.find(x => x.id === xrayId);
    if (demoXRay) {
      setXRay(convertDemoXRay(demoXRay));
    }
    setIsLoading(false);
  }, [xrayId]);

  return {
    xray,
    isLoading,
    isError,
  };
}
