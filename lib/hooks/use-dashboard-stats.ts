"use client";

import { useState, useEffect } from 'react';

export interface DashboardStats {
  totalPatients: number;
  analysesThisMonth: number;
  treatmentAcceptanceRate: number | null;
  pendingReviews: number;
}

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Return mock statistics
      setStats({
        totalPatients: 3,
        analysesThisMonth: 0,
        treatmentAcceptanceRate: null,
        pendingReviews: 0,
      });
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const mutate = () => {
    // No-op for mock data
  };

  return {
    stats,
    isLoading,
    isError,
    mutate,
  };
}
