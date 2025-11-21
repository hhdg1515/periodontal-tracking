import { supabase } from './client';
import { Database } from './database.types';

type XRay = Database['public']['Tables']['xrays']['Row'];
type XRayInsert = Database['public']['Tables']['xrays']['Insert'];

export const xraysService = {
  // Get all X-rays for a visit
  async getByVisitId(visitId: string) {
    const { data, error } = await supabase
      .from('xrays')
      .select('*')
      .eq('visit_id', visitId)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data as XRay[];
  },

  // Get a single X-ray by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('xrays')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as XRay;
  },

  // Upload X-ray file to storage
  async uploadFile(file: File, visitId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${visitId}/${Date.now()}.${fileExt}`;
    const filePath = `xrays/${fileName}`;

    const { data, error } = await supabase.storage
      .from('xrays')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('xrays')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Create X-ray record
  async create(xray: XRayInsert) {
    const { data, error } = await supabase
      .from('xrays')
      .insert(xray)
      .select()
      .single();

    if (error) throw error;
    return data as XRay;
  },

  // Upload and create X-ray in one operation
  async uploadAndCreate(file: File, visitId: string, xrayType: string) {
    // First upload the file
    const fileUrl = await this.uploadFile(file, visitId);

    // Then create the database record
    const xray = await this.create({
      visit_id: visitId,
      xray_type: xrayType,
      file_url: fileUrl,
      analysis_status: 'pending',
    });

    return xray;
  },

  // Delete X-ray
  async delete(id: string) {
    // First get the X-ray to get the file URL
    const xray = await this.getById(id);

    // Delete from storage
    const filePath = xray.file_url.split('/xrays/')[1];
    if (filePath) {
      await supabase.storage
        .from('xrays')
        .remove([`xrays/${filePath}`]);
    }

    // Delete from database
    const { error } = await supabase
      .from('xrays')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get X-rays for comparison (by patient)
  async getForComparison(patientId: string) {
    const { data, error } = await supabase
      .from('xrays')
      .select(`
        *,
        visit:visits!inner (
          patient_id,
          visit_date,
          visit_type
        )
      `)
      .eq('visit.patient_id', patientId)
      .order('visit.visit_date', { ascending: false });

    if (error) throw error;
    return data;
  },
};
