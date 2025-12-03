"use client";

import useSWR from 'swr';
import { statsService, DashboardStats } from '@/lib/supabase/stats-service';

// For now, using a hardcoded clinic ID for MVP
// In production, this would come from authentication context
const DEMO_CLINIC_ID = 'demo-clinic-id';

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    ['dashboard-stats', DEMO_CLINIC_ID],
    async () => {
      return await statsService.getDashboardStats(DEMO_CLINIC_ID);
    },
    {
      // Refresh every 30 seconds
      refreshInterval: 30000,
      // Revalidate on focus
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  };
}
