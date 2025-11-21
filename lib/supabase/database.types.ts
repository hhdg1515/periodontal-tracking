export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          name: string
          email: string
          subscription_tier: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subscription_tier?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subscription_tier?: string | null
          created_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          clinic_id: string
          patient_id: string
          first_name: string
          last_name: string
          date_of_birth: string
          email: string | null
          phone: string | null
          is_smoker: boolean | null
          has_diabetes: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          patient_id: string
          first_name: string
          last_name: string
          date_of_birth: string
          email?: string | null
          phone?: string | null
          is_smoker?: boolean | null
          has_diabetes?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          patient_id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          email?: string | null
          phone?: string | null
          is_smoker?: boolean | null
          has_diabetes?: boolean | null
          created_at?: string
        }
      }
      visits: {
        Row: {
          id: string
          patient_id: string
          visit_date: string
          visit_type: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          visit_date: string
          visit_type: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          visit_date?: string
          visit_type?: string
          notes?: string | null
          created_at?: string
        }
      }
      xrays: {
        Row: {
          id: string
          visit_id: string
          xray_type: string
          file_url: string
          upload_date: string
          analysis_status: string
          created_at: string
        }
        Insert: {
          id?: string
          visit_id: string
          xray_type: string
          file_url: string
          upload_date?: string
          analysis_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          visit_id?: string
          xray_type?: string
          file_url?: string
          upload_date?: string
          analysis_status?: string
          created_at?: string
        }
      }
      analysis_results: {
        Row: {
          id: string
          xray_id: string
          baseline_xray_id: string | null
          comparison_months: number | null
          total_teeth_analyzed: number | null
          worsening_count: number | null
          stable_count: number | null
          improving_count: number | null
          average_change: number | null
          tooth_findings: Json | null
          recommendation: string | null
          risk_level: string | null
          prediction_6_months: Json | null
          analyzed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          xray_id: string
          baseline_xray_id?: string | null
          comparison_months?: number | null
          total_teeth_analyzed?: number | null
          worsening_count?: number | null
          stable_count?: number | null
          improving_count?: number | null
          average_change?: number | null
          tooth_findings?: Json | null
          recommendation?: string | null
          risk_level?: string | null
          prediction_6_months?: Json | null
          analyzed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          xray_id?: string
          baseline_xray_id?: string | null
          comparison_months?: number | null
          total_teeth_analyzed?: number | null
          worsening_count?: number | null
          stable_count?: number | null
          improving_count?: number | null
          average_change?: number | null
          tooth_findings?: Json | null
          recommendation?: string | null
          risk_level?: string | null
          prediction_6_months?: Json | null
          analyzed_at?: string | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          analysis_id: string
          report_type: string
          pdf_url: string | null
          generated_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          report_type: string
          pdf_url?: string | null
          generated_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          report_type?: string
          pdf_url?: string | null
          generated_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          patient_id: string
          recommended_date: string
          treatment_type: string
          status: string
          completed_date: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          recommended_date: string
          treatment_type: string
          status: string
          completed_date?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          recommended_date?: string
          treatment_type?: string
          status?: string
          completed_date?: string | null
          notes?: string | null
        }
      }
    }
  }
}
