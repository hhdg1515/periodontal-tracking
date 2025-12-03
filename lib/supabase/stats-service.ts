import { supabase } from './client';

export interface DashboardStats {
  totalPatients: number;
  analysesThisMonth: number;
  treatmentAcceptanceRate: number | null;
  pendingReviews: number;
}

export const statsService = {
  /**
   * Get comprehensive dashboard statistics
   */
  async getDashboardStats(clinicId: string): Promise<DashboardStats> {
    // Get total patients count
    const { count: totalPatients, error: patientsError } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('clinic_id', clinicId);

    if (patientsError) throw patientsError;

    // Get analyses this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: analysesThisMonth, error: analysesError } = await supabase
      .from('analysis_results')
      .select('*', { count: 'exact', head: true })
      .gte('analyzed_at', startOfMonth.toISOString());

    if (analysesError) throw analysesError;

    // Get treatment acceptance rate
    const { data: treatments, error: treatmentsError } = await supabase
      .from('treatments')
      .select('status')
      .in('status', ['proposed', 'accepted', 'declined']);

    if (treatmentsError) throw treatmentsError;

    let treatmentAcceptanceRate: number | null = null;
    if (treatments && treatments.length > 0) {
      const acceptedCount = treatments.filter(t => t.status === 'accepted').length;
      const totalProposed = treatments.filter(t =>
        t.status === 'proposed' || t.status === 'accepted' || t.status === 'declined'
      ).length;

      if (totalProposed > 0) {
        treatmentAcceptanceRate = Math.round((acceptedCount / totalProposed) * 100);
      }
    }

    // Get pending reviews (X-rays with pending analysis status)
    const { count: pendingReviews, error: pendingError } = await supabase
      .from('xrays')
      .select('*', { count: 'exact', head: true })
      .eq('analysis_status', 'pending');

    if (pendingError) throw pendingError;

    return {
      totalPatients: totalPatients || 0,
      analysesThisMonth: analysesThisMonth || 0,
      treatmentAcceptanceRate,
      pendingReviews: pendingReviews || 0,
    };
  },

  /**
   * Get total patients count
   */
  async getTotalPatients(clinicId: string): Promise<number> {
    const { count, error } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('clinic_id', clinicId);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Get analyses count for the current month
   */
  async getAnalysesThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('analysis_results')
      .select('*', { count: 'exact', head: true })
      .gte('analyzed_at', startOfMonth.toISOString());

    if (error) throw error;
    return count || 0;
  },

  /**
   * Get pending reviews count (X-rays awaiting analysis)
   */
  async getPendingReviews(): Promise<number> {
    const { count, error } = await supabase
      .from('xrays')
      .select('*', { count: 'exact', head: true })
      .eq('analysis_status', 'pending');

    if (error) throw error;
    return count || 0;
  },

  /**
   * Calculate treatment acceptance rate
   */
  async getTreatmentAcceptanceRate(): Promise<number | null> {
    const { data, error } = await supabase
      .from('treatments')
      .select('status')
      .in('status', ['proposed', 'accepted', 'declined']);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const acceptedCount = data.filter(t => t.status === 'accepted').length;
    const totalProposed = data.filter(t =>
      t.status === 'proposed' || t.status === 'accepted' || t.status === 'declined'
    ).length;

    if (totalProposed === 0) return null;

    return Math.round((acceptedCount / totalProposed) * 100);
  },
};
