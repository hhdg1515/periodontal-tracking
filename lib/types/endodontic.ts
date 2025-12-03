// =====================================================
// 根管治疗模块类型定义
// Endodontic Module Types
// =====================================================

export type EndodonticCaseStatus =
  | "diagnosis"
  | "in_progress"
  | "completed"
  | "follow_up";

export type PulpVitality =
  | "vital"
  | "non_vital"
  | "irreversible_pulpitis"
  | "previously_treated";

export type PeriapicalStatus = "normal" | "mild_lesion" | "large_lesion";

export interface EndodonticVisit {
  id: string;
  case_id: string;
  visit_date: string;
  procedure: string;
  notes: string;
  medicaments?: string[];
  status: "completed" | "scheduled";
}

export interface EndodonticCase {
  id: string;
  patient_id: string;
  patient_name: string;
  tooth: string; // e.g. "#14"
  diagnosis: string;
  pulp_status: PulpVitality;
  periapical_status: PeriapicalStatus;
  canals: number;
  status: EndodonticCaseStatus;
  progress_percentage: number;
  last_visit?: string;
  next_visit?: string;
  ai_flags?: string[];
  visits: EndodonticVisit[];
}

export interface EndodonticStats {
  total_cases: number;
  active_cases: number;
  follow_up_cases: number;
  success_rate: number;
}

export const STATUS_LABELS: Record<EndodonticCaseStatus, string> = {
  diagnosis: "诊断",
  in_progress: "治疗中",
  completed: "已完成",
  follow_up: "复诊中",
};

export const STATUS_COLORS: Record<EndodonticCaseStatus, string> = {
  diagnosis: "yellow",
  in_progress: "orange",
  completed: "green",
  follow_up: "blue",
};

export const PULP_STATUS_LABELS: Record<PulpVitality, string> = {
  vital: "活髓",
  non_vital: "失活",
  irreversible_pulpitis: "不可逆性牙髓炎",
  previously_treated: "已根治牙",
};

export const PERIAPICAL_LABELS: Record<PeriapicalStatus, string> = {
  normal: "根尖正常",
  mild_lesion: "轻度根尖病变",
  large_lesion: "明显根尖透射区",
};
