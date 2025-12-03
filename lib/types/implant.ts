// =====================================================
// 种植牙模块类型定义
// Dental Implant Module Types
// =====================================================

export type ImplantStage =
  | 'consultation'    // 初诊咨询
  | 'planning'        // 手术规划
  | 'surgery'         // 手术植入
  | 'healing'         // 愈合期
  | 'abutment'        // 基台安装
  | 'restoration'     // 修复完成
  | 'maintenance';    // 维护期

export type ImplantType =
  | 'single'          // 单颗种植
  | 'multiple'        // 多颗种植
  | 'full_arch'       // 全口种植
  | 'all_on_4'        // All-on-4
  | 'all_on_6';       // All-on-6

export type ImplantBrand =
  | 'straumann'       // 士卓曼
  | 'nobel'           // 诺贝尔
  | 'zimmer'          // Zimmer
  | 'osstem'          // 奥齿泰
  | 'other';          // 其他

export type CaseStatus =
  | 'planned'         // 已规划
  | 'in_progress'     // 进行中
  | 'completed'       // 已完成
  | 'on_hold'         // 暂停
  | 'cancelled';      // 已取消

export type ComplicationLevel =
  | 'none'            // 无
  | 'minor'           // 轻微
  | 'moderate'        // 中度
  | 'severe';         // 严重

// 种植案例
export interface ImplantCase {
  id: string;
  patient_id: string;
  patient_name: string;

  // 案例信息
  case_type: ImplantType;
  implant_brand: ImplantBrand;
  current_stage: ImplantStage;
  status: CaseStatus;

  // 牙位信息
  tooth_positions: string[];  // e.g., ["14", "15", "16"]
  implant_count: number;

  // 时间规划
  consultation_date?: string;
  surgery_date?: string;
  expected_completion?: string;
  actual_completion?: string;

  // 治疗进展
  progress_percentage: number;
  timeline: ImplantTimeline[];

  // 临床数据
  bone_quality?: string;      // 骨质评估
  bone_grafting_needed?: boolean;
  sinus_lift_needed?: boolean;

  // 文件和图像
  cbct_scans?: string[];      // CBCT扫描
  photos?: string[];          // 临床照片
  xrays?: string[];           // X光片

  // 并发症
  complications?: ImplantComplication[];

  // 备注
  notes?: string;
  surgeon_name?: string;

  created_at: string;
  updated_at: string;
}

// 种植时间线
export interface ImplantTimeline {
  stage: ImplantStage;
  stage_name: string;
  planned_date?: string;
  actual_date?: string;
  duration_weeks?: number;
  status: 'upcoming' | 'current' | 'completed' | 'delayed';
  notes?: string;
}

// 并发症记录
export interface ImplantComplication {
  id: string;
  case_id: string;
  date: string;
  type: string;              // e.g., "感染", "松动", "疼痛"
  severity: ComplicationLevel;
  description: string;
  treatment: string;
  resolved: boolean;
  resolution_date?: string;
}

// 种植体详细信息
export interface ImplantDetails {
  id: string;
  case_id: string;
  tooth_position: string;

  // 种植体信息
  implant_brand: ImplantBrand;
  implant_system: string;
  diameter: number;           // mm
  length: number;             // mm
  platform: string;

  // 手术信息
  surgery_date: string;
  torque_value?: number;      // 扭矩值
  primary_stability?: string; // 初期稳定性

  // 基台信息
  abutment_type?: string;
  abutment_date?: string;

  // 修复信息
  crown_type?: string;        // 冠类型
  crown_material?: string;    // 材料
  crown_date?: string;

  // 状态
  osseointegration_status?: string; // 骨结合状态
  success: boolean;

  created_at: string;
}

// 种植规划
export interface ImplantPlan {
  id: string;
  case_id: string;

  // 诊断
  diagnosis: string;
  treatment_objectives: string[];

  // 手术规划
  surgical_approach: string;
  anesthesia_type: string;
  expected_duration: string;  // e.g., "2-3 hours"

  // 材料清单
  materials_needed: string[];
  estimated_cost: number;

  // 风险评估
  risk_factors: string[];
  contraindications?: string[];

  // 替代方案
  alternative_treatments?: string[];

  // 同意书
  consent_obtained: boolean;
  consent_date?: string;

  created_at: string;
  updated_at: string;
}

// =====================================================
// UI Helper Types
// =====================================================

export interface ImplantStats {
  total_cases: number;
  active_cases: number;
  completed_cases: number;
  total_implants: number;
  success_rate: number;
}

export const STAGE_LABELS: Record<ImplantStage, string> = {
  consultation: '初诊咨询',
  planning: '手术规划',
  surgery: '手术植入',
  healing: '愈合期',
  abutment: '基台安装',
  restoration: '修复完成',
  maintenance: '维护期',
};

export const TYPE_LABELS: Record<ImplantType, string> = {
  single: '单颗种植',
  multiple: '多颗种植',
  full_arch: '全口种植',
  all_on_4: 'All-on-4',
  all_on_6: 'All-on-6',
};

export const BRAND_LABELS: Record<ImplantBrand, string> = {
  straumann: '士卓曼 (Straumann)',
  nobel: '诺贝尔 (Nobel Biocare)',
  zimmer: 'Zimmer Biomet',
  osstem: '奥齿泰 (Osstem)',
  other: '其他品牌',
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  planned: '已规划',
  in_progress: '进行中',
  completed: '已完成',
  on_hold: '暂停',
  cancelled: '已取消',
};

export const STATUS_COLORS: Record<CaseStatus, string> = {
  planned: 'yellow',
  in_progress: 'blue',
  completed: 'green',
  on_hold: 'orange',
  cancelled: 'gray',
};

// 阶段进度计算
export function calculateStageProgress(stage: ImplantStage): number {
  const stageOrder: ImplantStage[] = [
    'consultation',
    'planning',
    'surgery',
    'healing',
    'abutment',
    'restoration',
    'maintenance',
  ];

  const index = stageOrder.indexOf(stage);
  return Math.round(((index + 1) / stageOrder.length) * 100);
}

// 阶段颜色
export function getStageColor(stage: ImplantStage): string {
  const colors: Record<ImplantStage, string> = {
    consultation: 'gray',
    planning: 'blue',
    surgery: 'purple',
    healing: 'yellow',
    abutment: 'orange',
    restoration: 'green',
    maintenance: 'teal',
  };
  return colors[stage];
}
