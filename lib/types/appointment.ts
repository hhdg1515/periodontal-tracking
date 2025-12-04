export type AppointmentService = "periodontal" | "endodontic" | "implant" | "cosmetic";

export type AppointmentStatus = "scheduled" | "pending_confirm" | "confirmed" | "completed" | "cancelled";

export type AppointmentPriority = "routine" | "urgent";

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  service: AppointmentService;
  tooth?: string;
  priority: AppointmentPriority;
  datetime: string;
  doctor?: string;
  notes?: string;
  status: AppointmentStatus;
  created_at: string;
}
