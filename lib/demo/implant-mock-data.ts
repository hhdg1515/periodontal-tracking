import {
  ImplantCase,
  ImplantTimeline,
  ImplantStats,
  ImplantComplication,
  calculateStageProgress,
} from '../types/implant';

// =====================================================
// Mock 种植案例数据
// =====================================================

export const DEMO_IMPLANT_CASES: ImplantCase[] = [
  {
    id: 'implant-001',
    patient_id: 'demo-006',
    patient_name: 'Robert Zhang',
    case_type: 'single',
    implant_brand: 'straumann',
    current_stage: 'healing',
    status: 'in_progress',
    tooth_positions: ['14'],
    implant_count: 1,
    consultation_date: '2024-10-15',
    surgery_date: '2024-11-01',
    expected_completion: '2025-02-01',
    progress_percentage: 60,
    timeline: [
      {
        stage: 'consultation',
        stage_name: '初诊咨询',
        planned_date: '2024-10-15',
        actual_date: '2024-10-15',
        status: 'completed',
        notes: '患者右上第一前磨牙缺失，骨量充足',
      },
      {
        stage: 'planning',
        stage_name: '手术规划',
        planned_date: '2024-10-22',
        actual_date: '2024-10-25',
        status: 'completed',
        notes: '完成CBCT扫描，制定数字化种植方案',
      },
      {
        stage: 'surgery',
        stage_name: '手术植入',
        planned_date: '2024-11-01',
        actual_date: '2024-11-01',
        duration_weeks: 1,
        status: 'completed',
        notes: '手术顺利，植入士卓曼BLX 4.0×10mm种植体',
      },
      {
        stage: 'healing',
        stage_name: '愈合期（3个月）',
        planned_date: '2024-11-01',
        duration_weeks: 12,
        status: 'current',
        notes: '骨结合进展良好，预计2025年2月完成',
      },
      {
        stage: 'abutment',
        stage_name: '基台安装',
        planned_date: '2025-02-01',
        duration_weeks: 1,
        status: 'upcoming',
      },
      {
        stage: 'restoration',
        stage_name: '修复完成',
        planned_date: '2025-02-08',
        duration_weeks: 1,
        status: 'upcoming',
      },
    ],
    bone_quality: 'D2 - 致密骨质',
    bone_grafting_needed: false,
    sinus_lift_needed: false,
    cbct_scans: [
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800',
    ],
    photos: [
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
    ],
    notes: '患者配合度高，口腔卫生良好',
    surgeon_name: 'Dr. Chen',
    created_at: '2024-10-15T10:00:00Z',
    updated_at: '2024-12-01T14:00:00Z',
  },
  {
    id: 'implant-002',
    patient_id: 'demo-007',
    patient_name: 'Jennifer Liu',
    case_type: 'multiple',
    implant_brand: 'nobel',
    current_stage: 'restoration',
    status: 'in_progress',
    tooth_positions: ['36', '37'],
    implant_count: 2,
    consultation_date: '2024-08-10',
    surgery_date: '2024-09-05',
    expected_completion: '2024-12-20',
    progress_percentage: 85,
    timeline: [
      {
        stage: 'consultation',
        stage_name: '初诊咨询',
        actual_date: '2024-08-10',
        status: 'completed',
      },
      {
        stage: 'planning',
        stage_name: '手术规划',
        actual_date: '2024-08-20',
        status: 'completed',
      },
      {
        stage: 'surgery',
        stage_name: '手术植入',
        actual_date: '2024-09-05',
        status: 'completed',
        notes: '同时植入两颗诺贝尔种植体',
      },
      {
        stage: 'healing',
        stage_name: '愈合期',
        actual_date: '2024-09-05',
        status: 'completed',
        notes: '3个月愈合期顺利完成',
      },
      {
        stage: 'abutment',
        stage_name: '基台安装',
        actual_date: '2024-12-05',
        status: 'completed',
      },
      {
        stage: 'restoration',
        stage_name: '修复完成',
        planned_date: '2024-12-20',
        status: 'current',
        notes: '正在制作全瓷冠',
      },
    ],
    bone_quality: 'D3 - 疏松骨质',
    bone_grafting_needed: true,
    sinus_lift_needed: false,
    cbct_scans: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    ],
    photos: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
    ],
    notes: '左下两颗磨牙同时种植，已完成基台安装',
    surgeon_name: 'Dr. Wang',
    created_at: '2024-08-10T09:00:00Z',
    updated_at: '2024-12-05T16:00:00Z',
  },
  {
    id: 'implant-003',
    patient_id: 'demo-003',
    patient_name: 'Emily Rodriguez',
    case_type: 'all_on_4',
    implant_brand: 'straumann',
    current_stage: 'planning',
    status: 'planned',
    tooth_positions: ['All Upper Arch'],
    implant_count: 4,
    consultation_date: '2024-11-25',
    expected_completion: '2025-03-15',
    progress_percentage: 15,
    timeline: [
      {
        stage: 'consultation',
        stage_name: '初诊咨询',
        actual_date: '2024-11-25',
        status: 'completed',
        notes: '上颌全口缺失，适合All-on-4方案',
      },
      {
        stage: 'planning',
        stage_name: '手术规划',
        planned_date: '2024-12-10',
        status: 'current',
        notes: '进行详细CBCT分析和数字化设计',
      },
      {
        stage: 'surgery',
        stage_name: '手术植入',
        planned_date: '2025-01-15',
        duration_weeks: 1,
        status: 'upcoming',
      },
      {
        stage: 'healing',
        stage_name: '愈合期',
        planned_date: '2025-01-15',
        duration_weeks: 8,
        status: 'upcoming',
      },
      {
        stage: 'restoration',
        stage_name: '最终修复',
        planned_date: '2025-03-15',
        duration_weeks: 2,
        status: 'upcoming',
      },
    ],
    bone_quality: 'D3 - 疏松骨质',
    bone_grafting_needed: false,
    sinus_lift_needed: false,
    cbct_scans: [],
    photos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
    ],
    notes: 'All-on-4即刻负重方案，当天可戴临时义齿',
    surgeon_name: 'Dr. Li',
    created_at: '2024-11-25T11:00:00Z',
    updated_at: '2024-11-25T11:00:00Z',
  },
  {
    id: 'implant-004',
    patient_id: 'demo-008',
    patient_name: 'Anna Wu',
    case_type: 'single',
    implant_brand: 'osstem',
    current_stage: 'maintenance',
    status: 'completed',
    tooth_positions: ['21'],
    implant_count: 1,
    consultation_date: '2024-03-10',
    surgery_date: '2024-04-15',
    expected_completion: '2024-08-01',
    actual_completion: '2024-08-01',
    progress_percentage: 100,
    timeline: [
      {
        stage: 'consultation',
        stage_name: '初诊咨询',
        actual_date: '2024-03-10',
        status: 'completed',
      },
      {
        stage: 'planning',
        stage_name: '手术规划',
        actual_date: '2024-03-25',
        status: 'completed',
      },
      {
        stage: 'surgery',
        stage_name: '手术植入',
        actual_date: '2024-04-15',
        status: 'completed',
      },
      {
        stage: 'healing',
        stage_name: '愈合期',
        actual_date: '2024-04-15',
        status: 'completed',
      },
      {
        stage: 'abutment',
        stage_name: '基台安装',
        actual_date: '2024-07-15',
        status: 'completed',
      },
      {
        stage: 'restoration',
        stage_name: '修复完成',
        actual_date: '2024-08-01',
        status: 'completed',
        notes: '安装全瓷冠，效果理想',
      },
      {
        stage: 'maintenance',
        stage_name: '维护期',
        status: 'completed',
        notes: '定期复查，种植体稳定',
      },
    ],
    bone_quality: 'D2 - 致密骨质',
    bone_grafting_needed: false,
    sinus_lift_needed: false,
    photos: [
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
    ],
    notes: '前牙美学区种植，患者非常满意',
    surgeon_name: 'Dr. Zhang',
    created_at: '2024-03-10T14:00:00Z',
    updated_at: '2024-08-01T15:00:00Z',
  },
];

// =====================================================
// Mock 并发症数据
// =====================================================

export const DEMO_COMPLICATIONS: ImplantComplication[] = [
  {
    id: 'comp-001',
    case_id: 'implant-002',
    date: '2024-09-10',
    type: '轻微出血',
    severity: 'minor',
    description: '术后第5天出现少量出血',
    treatment: '局部压迫止血，抗生素治疗',
    resolved: true,
    resolution_date: '2024-09-12',
  },
];

// =====================================================
// Mock 统计数据
// =====================================================

export const DEMO_IMPLANT_STATS: ImplantStats = {
  total_cases: 4,
  active_cases: 3,
  completed_cases: 1,
  total_implants: 8,
  success_rate: 97.5,
};

// =====================================================
// Helper Functions
// =====================================================

export function getDemoImplantCaseById(id: string): ImplantCase | undefined {
  return DEMO_IMPLANT_CASES.find(c => c.id === id);
}

export function getDemoImplantCasesByPatientId(patientId: string): ImplantCase[] {
  return DEMO_IMPLANT_CASES.filter(c => c.patient_id === patientId);
}

export function getDemoComplicationsByCaseId(caseId: string): ImplantComplication[] {
  return DEMO_COMPLICATIONS.filter(c => c.case_id === caseId);
}

export function getActiveCases(): ImplantCase[] {
  return DEMO_IMPLANT_CASES.filter(c => c.status === 'in_progress');
}

export function getCompletedCases(): ImplantCase[] {
  return DEMO_IMPLANT_CASES.filter(c => c.status === 'completed');
}
