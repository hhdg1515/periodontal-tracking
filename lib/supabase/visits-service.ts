import { supabase } from './client';
import { Database } from './database.types';

type Visit = Database['public']['Tables']['visits']['Row'];
type VisitInsert = Database['public']['Tables']['visits']['Insert'];
type VisitUpdate = Database['public']['Tables']['visits']['Update'];

export const visitsService = {
  // Get all visits for a patient
  async getByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        xrays (
          id,
          xray_type,
          file_url,
          upload_date,
          analysis_status
        )
      `)
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single visit by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        xrays (
          id,
          xray_type,
          file_url,
          upload_date,
          analysis_status
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new visit
  async create(visit: VisitInsert) {
    const { data, error } = await supabase
      .from('visits')
      .insert(visit)
      .select()
      .single();

    if (error) throw error;
    return data as Visit;
  },

  // Update a visit
  async update(id: string, updates: VisitUpdate) {
    const { data, error } = await supabase
      .from('visits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Visit;
  },

  // Delete a visit
  async delete(id: string) {
    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
