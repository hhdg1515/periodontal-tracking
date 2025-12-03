import {
  CosmeticConsultation,
  CosmeticTreatmentPlan,
  BeforeAfterPhoto,
  CosmeticStats,
} from '../types/cosmetic';

// =====================================================
// Mock 美容咨询数据
// =====================================================

export const DEMO_CONSULTATIONS: CosmeticConsultation[] = [
  {
    id: 'consult-001',
    patient_id: 'demo-001',
    patient_name: 'Sarah Johnson',
    consultation_date: '2024-11-20',
    status: 'completed',
    desired_outcome: '更白更整齐的笑容，适合商务场合',
    concerns: ['牙齿发黄', '前牙略有不齐', '笑容不自信'],
    current_shade: 'A3',
    desired_shade: 'A1',
    smile_analysis: '前牙略有轻微不齐，色泽不均匀，适合美白+贴面组合治疗',
    recommended_treatments: ['whitening', 'veneers'],
    estimated_duration: '2-3 个月',
    before_photos: [
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
    ],
    notes: '患者对美观要求较高，建议先美白观察效果后再考虑贴面',
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-20T10:30:00Z',
  },
  {
    id: 'consult-002',
    patient_id: 'demo-002',
    patient_name: 'Michael Chen',
    consultation_date: '2024-11-25',
    status: 'completed',
    desired_outcome: '快速美白牙齿，即将参加婚礼',
    concerns: ['牙齿偏黄', '时间紧迫', '需要快速见效'],
    current_shade: 'A3.5',
    desired_shade: 'B1',
    smile_analysis: '牙齿结构良好，主要问题是色素沉着，适合专业美白治疗',
    recommended_treatments: ['whitening'],
    estimated_duration: '2-3 周',
    before_photos: [
      'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800',
    ],
    notes: '婚礼在 3 周后，推荐诊室美白 + 家用套装组合',
    created_at: '2024-11-25T14:00:00Z',
    updated_at: '2024-11-25T14:45:00Z',
  },
  {
    id: 'consult-003',
    patient_id: 'demo-003',
    patient_name: 'Emily Rodriguez',
    consultation_date: '2024-12-01',
    status: 'scheduled',
    desired_outcome: '完美的好莱坞式笑容',
    concerns: ['牙齿大小不一', '颜色不均', '缺少 1 颗门牙'],
    recommended_treatments: ['veneers', 'crowns'],
    estimated_duration: '3-4 个月',
    before_photos: [],
    notes: '初诊咨询，需要详细评估并制定全面治疗方案',
    created_at: '2024-11-28T09:00:00Z',
    updated_at: '2024-11-28T09:00:00Z',
  },
  {
    id: 'consult-004',
    patient_id: 'demo-004',
    patient_name: 'David Kim',
    consultation_date: '2024-11-15',
    status: 'completed',
    desired_outcome: '修复前牙缺损',
    concerns: ['前牙有裂缝', '影响美观', '担心继续恶化'],
    current_shade: 'A2',
    smile_analysis: '右上 1 号牙有明显裂纹，建议贴面修复保护牙齿',
    recommended_treatments: ['veneers', 'bonding'],
    estimated_duration: '3-4 周',
    before_photos: [
      'https://images.unsplash.com/photo-1609274870937-65ab4b37084c?w=800',
    ],
    notes: '患者年轻，牙齿结构良好，优先考虑保守治疗',
    created_at: '2024-11-15T11:00:00Z',
    updated_at: '2024-11-15T12:00:00Z',
  },
  {
    id: 'consult-005',
    patient_id: 'demo-005',
    patient_name: 'Lisa Wang',
    consultation_date: '2024-11-10',
    status: 'completed',
    desired_outcome: '改善牙龈露出过多的问题',
    concerns: ['笑的时候露牙龈太多', '影响美观', '不敢大笑'],
    smile_analysis: '牙龈露出过多（gummy smile），建议牙龈整形或结合正畸治疗',
    recommended_treatments: ['gum_contouring', 'orthodontics'],
    estimated_duration: '4-6 个月',
    before_photos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
    ],
    notes: '考虑先进行牙龈整形，再评估是否需要正畸',
    created_at: '2024-11-10T15:00:00Z',
    updated_at: '2024-11-10T16:00:00Z',
  },
];

// =====================================================
// Mock 治疗方案数据
// =====================================================

export const DEMO_TREATMENT_PLANS: CosmeticTreatmentPlan[] = [
  {
    id: 'plan-001',
    consultation_id: 'consult-001',
    patient_id: 'demo-001',
    patient_name: 'Sarah Johnson',
    treatment_type: 'veneers',
    treatment_name: '前牙瓷贴面修复（6颗）',
    description: '上前牙 6 颗超薄瓷贴面，结合专业美白，打造自然完美笑容',
    steps: [
      {
        step_number: 1,
        title: '初诊检查和方案设计',
        description: '拍摄口内照片、X光片，取模制作诊断蜡型',
        duration: '1 次就诊',
        completed: true,
        completion_date: '2024-11-20',
      },
      {
        step_number: 2,
        title: '专业美白治疗',
        description: '诊室美白 + 家用美白套装，提升整体牙齿色阶',
        duration: '2-3 周',
        completed: true,
        completion_date: '2024-12-05',
      },
      {
        step_number: 3,
        title: '牙齿预备',
        description: '微创预备前牙，取精确印模',
        duration: '1 次就诊',
        completed: false,
      },
      {
        step_number: 4,
        title: '试戴和调整',
        description: '试戴临时贴面，确认形态和颜色',
        duration: '1 次就诊',
        completed: false,
      },
      {
        step_number: 5,
        title: '最终粘接',
        description: '永久粘接瓷贴面，抛光调整',
        duration: '1 次就诊',
        completed: false,
      },
    ],
    start_date: '2024-11-20',
    expected_completion: '2025-01-20',
    total_visits: 5,
    status: 'in_progress',
    progress_percentage: 40,
    before_photos: [
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
    ],
    during_photos: [
      'https://images.unsplash.com/photo-1609274870937-65ab4b37084c?w=800',
    ],
    created_at: '2024-11-20T11:00:00Z',
    updated_at: '2024-12-05T14:00:00Z',
  },
  {
    id: 'plan-002',
    consultation_id: 'consult-002',
    patient_id: 'demo-002',
    patient_name: 'Michael Chen',
    treatment_type: 'whitening',
    treatment_name: '快速专业美白',
    description: '诊室激光美白 + 家用美白套装，快速提升 3-5 个色阶',
    steps: [
      {
        step_number: 1,
        title: '口腔检查和清洁',
        description: '全口检查，专业洗牙，去除牙石和色素',
        duration: '1 小时',
        completed: true,
        completion_date: '2024-11-25',
      },
      {
        step_number: 2,
        title: '诊室激光美白',
        description: '使用冷光美白技术，立即提升 2-3 个色阶',
        duration: '1.5 小时',
        completed: true,
        completion_date: '2024-11-28',
      },
      {
        step_number: 3,
        title: '家用美白套装',
        description: '定制美白托盘，每天使用 1-2 小时，持续 2 周',
        duration: '2 周',
        completed: false,
      },
    ],
    start_date: '2024-11-25',
    expected_completion: '2024-12-15',
    total_visits: 2,
    status: 'in_progress',
    progress_percentage: 70,
    before_photos: [
      'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800',
    ],
    during_photos: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
    ],
    created_at: '2024-11-25T15:00:00Z',
    updated_at: '2024-11-28T16:00:00Z',
  },
  {
    id: 'plan-003',
    consultation_id: 'consult-004',
    patient_id: 'demo-004',
    patient_name: 'David Kim',
    treatment_type: 'bonding',
    treatment_name: '前牙粘接修复',
    description: '使用复合树脂修复前牙裂纹，恢复美观和功能',
    steps: [
      {
        step_number: 1,
        title: '详细检查',
        description: '评估裂纹深度，确定修复方案',
        duration: '30 分钟',
        completed: true,
        completion_date: '2024-11-15',
      },
      {
        step_number: 2,
        title: '粘接修复',
        description: '清理裂纹，使用高质量复合树脂分层充填，抛光',
        duration: '1.5 小时',
        completed: true,
        completion_date: '2024-11-18',
      },
      {
        step_number: 3,
        title: '复查',
        description: '检查修复效果，调整咬合',
        duration: '30 分钟',
        completed: true,
        completion_date: '2024-11-25',
      },
    ],
    start_date: '2024-11-15',
    expected_completion: '2024-11-25',
    total_visits: 3,
    status: 'completed',
    progress_percentage: 100,
    before_photos: [
      'https://images.unsplash.com/photo-1609274870937-65ab4b37084c?w=800',
    ],
    after_photos: [
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
    ],
    created_at: '2024-11-15T12:00:00Z',
    updated_at: '2024-11-25T15:00:00Z',
  },
];

// =====================================================
// Mock Before/After 照片数据
// =====================================================

export const DEMO_BEFORE_AFTER: BeforeAfterPhoto[] = [
  {
    id: 'ba-001',
    treatment_plan_id: 'plan-003',
    patient_id: 'demo-004',
    before_photo: 'https://images.unsplash.com/photo-1609274870937-65ab4b37084c?w=800',
    after_photo: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
    before_date: '2024-11-15',
    after_date: '2024-11-25',
    angle: 'front',
    description: '前牙粘接修复 - 正面对比',
    visible_improvements: [
      '裂纹完全修复',
      '颜色自然匹配',
      '表面光滑平整',
    ],
    created_at: '2024-11-25T15:30:00Z',
  },
  {
    id: 'ba-002',
    treatment_plan_id: 'plan-002',
    patient_id: 'demo-002',
    before_photo: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800',
    after_photo: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
    before_date: '2024-11-25',
    after_date: '2024-11-28',
    angle: 'smile',
    description: '美白治疗 - 笑容对比',
    visible_improvements: [
      '牙齿明显变白',
      '色阶提升 3 级',
      '笑容更加自信',
    ],
    created_at: '2024-11-28T17:00:00Z',
  },
];

// =====================================================
// Mock 统计数据
// =====================================================

export const DEMO_COSMETIC_STATS: CosmeticStats = {
  total_consultations: 5,
  active_treatments: 2,
  completed_treatments: 1,
};

// =====================================================
// Helper Functions
// =====================================================

export function getDemoConsultationById(id: string): CosmeticConsultation | undefined {
  return DEMO_CONSULTATIONS.find(c => c.id === id);
}

export function getDemoConsultationsByPatientId(patientId: string): CosmeticConsultation[] {
  return DEMO_CONSULTATIONS.filter(c => c.patient_id === patientId);
}

export function getDemoTreatmentPlanById(id: string): CosmeticTreatmentPlan | undefined {
  return DEMO_TREATMENT_PLANS.find(p => p.id === id);
}

export function getDemoTreatmentPlansByPatientId(patientId: string): CosmeticTreatmentPlan[] {
  return DEMO_TREATMENT_PLANS.filter(p => p.patient_id === patientId);
}

export function getDemoBeforeAfterByTreatmentId(treatmentId: string): BeforeAfterPhoto[] {
  return DEMO_BEFORE_AFTER.filter(ba => ba.treatment_plan_id === treatmentId);
}
