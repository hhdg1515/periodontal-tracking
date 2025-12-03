// =====================================================
// 牙齿美容模块类型定义
// Cosmetic Dentistry Module Types
// =====================================================

export type CosmeticTreatmentType =
  | 'whitening'        // 牙齿美白
  | 'veneers'          // 贴面
  | 'bonding'          // 粘接修复
  | 'crowns'           // 全瓷冠
  | 'orthodontics'     // 正畸
  | 'gum_contouring'   // 牙龈整形
  | 'smile_makeover';  // 笑容改造

export type ConsultationStatus =
  | 'scheduled'   // 已预约
  | 'completed'   // 已完成
  | 'cancelled'   // 已取消
  | 'no_show';    // 未到场

export type TreatmentStatus =
  | 'planned'      // 已规划
  | 'in_progress'  // 进行中
  | 'completed'    // 已完成
  | 'on_hold'      // 暂停
  | 'cancelled';   // 已取消

// 美容咨询记录
export interface CosmeticConsultation {
  id: string;
  patient_id: string;
  patient_name: string;

  // 咨询信息
  consultation_date: string;
  status: ConsultationStatus;
  desired_outcome: string;  // 期望效果
  concerns: string[];       // 主要关注点

  // 评估
  current_shade?: string;   // 当前牙齿色阶
  desired_shade?: string;   // 期望色阶
  smile_analysis?: string;  // 笑容分析

  // 推荐治疗
  recommended_treatments: CosmeticTreatmentType[];
  estimated_duration?: string; // e.g., "2-3 months"

  // Before 照片
  before_photos: string[];

  // 笔记
  notes?: string;

  created_at: string;
  updated_at: string;
}

// 美容治疗方案
export interface CosmeticTreatmentPlan {
  id: string;
  consultation_id: string;
  patient_id: string;
  patient_name: string;

  // 方案信息
  treatment_type: CosmeticTreatmentType;
  treatment_name: string;
  description: string;

  // 详细步骤
  steps: TreatmentStep[];

  // 时间规划
  start_date?: string;
  expected_completion?: string;
  total_visits: number;

  // 状态
  status: TreatmentStatus;
  progress_percentage: number;

  // 照片记录
  before_photos: string[];
  during_photos?: string[];
  after_photos?: string[];

  created_at: string;
  updated_at: string;
}

// 治疗步骤
export interface TreatmentStep {
  step_number: number;
  title: string;
  description: string;
  duration?: string;
  completed: boolean;
  completion_date?: string;
  notes?: string;
}

// Before/After 照片对比
export interface BeforeAfterPhoto {
  id: string;
  treatment_plan_id: string;
  patient_id: string;

  before_photo: string;
  after_photo: string;

  // 拍摄信息
  before_date: string;
  after_date: string;
  angle: 'front' | 'side' | 'close_up' | 'smile';

  // 描述
  description?: string;
  visible_improvements?: string[];

  created_at: string;
}

// 美容评估（用于 AI 分析）
export interface CosmeticAssessment {
  id: string;
  consultation_id: string;

  // 牙齿颜色分析
  shade_analysis: {
    current_shade: string;
    uniformity_score: number; // 0-100
    stain_level: 'none' | 'mild' | 'moderate' | 'severe';
    whitening_potential: number; // 预期可提升的色阶数
  };

  // 笑容分析
  smile_analysis: {
    symmetry_score: number; // 0-100
    gum_visibility: 'normal' | 'excessive' | 'minimal';
    tooth_proportions: 'ideal' | 'needs_adjustment';
    midline_alignment: boolean;
  };

  // 推荐
  recommendations: string[];
  priority_score: number; // 1-10

  created_at: string;
}

// =====================================================
// UI Helper Types
// =====================================================

export interface CosmeticStats {
  total_consultations: number;
  active_treatments: number;
  completed_treatments: number;
}

export const TREATMENT_TYPE_LABELS: Record<CosmeticTreatmentType, string> = {
  whitening: '牙齿美白',
  veneers: '瓷贴面',
  bonding: '粘接修复',
  crowns: '全瓷冠',
  orthodontics: '牙齿矫正',
  gum_contouring: '牙龈整形',
  smile_makeover: '笑容改造',
};

export const STATUS_LABELS: Record<ConsultationStatus | TreatmentStatus, string> = {
  scheduled: '已预约',
  completed: '已完成',
  cancelled: '已取消',
  no_show: '未到场',
  planned: '已规划',
  in_progress: '进行中',
  on_hold: '暂停',
};

export const STATUS_COLORS: Record<ConsultationStatus | TreatmentStatus, string> = {
  scheduled: 'blue',
  completed: 'green',
  cancelled: 'gray',
  no_show: 'red',
  planned: 'yellow',
  in_progress: 'blue',
  on_hold: 'orange',
};
