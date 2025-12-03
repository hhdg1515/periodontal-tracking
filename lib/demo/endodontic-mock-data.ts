import {
  EndodonticCase,
  EndodonticStats,
  EndodonticVisit,
} from "@/lib/types/endodontic";

// =====================================================
// Mock 根管治疗数据
// =====================================================

const createVisit = (
  data: EndodonticVisit
): EndodonticVisit => ({
  ...data,
});

export const DEMO_ENDODONTIC_CASES: EndodonticCase[] = [
  {
    id: "endo-001",
    patient_id: "demo-002",
    patient_name: "Michael Chen",
    tooth: "#36",
    diagnosis: "不可逆性牙髓炎 + 症状性根尖周炎",
    pulp_status: "irreversible_pulpitis",
    periapical_status: "mild_lesion",
    canals: 3,
    status: "in_progress",
    progress_percentage: 60,
    last_visit: "2024-12-05",
    next_visit: "2024-12-20T10:00:00Z",
    ai_flags: [
      "AI: 建议加查 MB2 根管，置信度 82%",
      "根尖透射区较上次缩小 18%",
    ],
    visits: [
      createVisit({
        id: "endo-001-v1",
        case_id: "endo-001",
        visit_date: "2024-11-30",
        procedure: "开髓 + 确定根管工作长度",
        notes: "使用电子根测仪 + X光确认 WL 19mm",
        medicaments: ["5.25% 次氯酸钠冲洗"],
        status: "completed",
      }),
      createVisit({
        id: "endo-001-v2",
        case_id: "endo-001",
        visit_date: "2024-12-05",
        procedure: "根管预备 + 涂药",
        notes: "Protaper Gold 预备至 F2，根尖干爽",
        medicaments: ["氢氧化钙根管糊剂"],
        status: "completed",
      }),
      createVisit({
        id: "endo-001-v3",
        case_id: "endo-001",
        visit_date: "2024-12-20",
        procedure: "根管充填 + 修复",
        notes: "预约确认，计划使用热牙胶",
        status: "scheduled",
      }),
    ],
  },
  {
    id: "endo-002",
    patient_id: "demo-004",
    patient_name: "David Kim",
    tooth: "#11",
    diagnosis: "牙髓坏死 + 慢性根尖周炎",
    pulp_status: "non_vital",
    periapical_status: "large_lesion",
    canals: 1,
    status: "follow_up",
    progress_percentage: 100,
    last_visit: "2024-10-01",
    next_visit: "2025-01-10T09:00:00Z",
    ai_flags: ["AI: 根尖透射区恢复 32%，建议 3 个月复查"],
    visits: [
      createVisit({
        id: "endo-002-v1",
        case_id: "endo-002",
        visit_date: "2024-08-20",
        procedure: "再治疗开髓",
        notes: "拆除旧根充材料，根管内部清理干净",
        status: "completed",
      }),
      createVisit({
        id: "endo-002-v2",
        case_id: "endo-002",
        visit_date: "2024-09-05",
        procedure: "根管预备 + 临时封闭",
        notes: "使用超声加强冲洗，根尖干净",
        medicaments: ["氢氧化钙糊剂"],
        status: "completed",
      }),
      createVisit({
        id: "endo-002-v3",
        case_id: "endo-002",
        visit_date: "2024-10-01",
        procedure: "根管充填 + 纤维桩",
        notes: "热牙胶充填 + 玻纤桩 + 临时冠",
        status: "completed",
      }),
    ],
  },
  {
    id: "endo-003",
    patient_id: "demo-005",
    patient_name: "Lisa Wang",
    tooth: "#26",
    diagnosis: "可逆性牙髓炎，监测中",
    pulp_status: "vital",
    periapical_status: "normal",
    canals: 4,
    status: "diagnosis",
    progress_percentage: 35,
    next_visit: "2024-12-18T11:00:00Z",
    visits: [
      createVisit({
        id: "endo-003-v1",
        case_id: "endo-003",
        visit_date: "2024-12-02",
        procedure: "急诊缓解 + 牙髓评估",
        notes: "冷测阳性但轻微延迟，计划随访",
        status: "completed",
      }),
      createVisit({
        id: "endo-003-v2",
        case_id: "endo-003",
        visit_date: "2024-12-18",
        procedure: "复查症状 + 决定是否开髓",
        notes: "待确认是否需要主动根管治疗",
        status: "scheduled",
      }),
    ],
  },
];

export const DEMO_ENDODONTIC_STATS: EndodonticStats = {
  total_cases: DEMO_ENDODONTIC_CASES.length,
  active_cases: DEMO_ENDODONTIC_CASES.filter((c) => c.status === "in_progress")
    .length,
  follow_up_cases: DEMO_ENDODONTIC_CASES.filter((c) =>
    ["follow_up", "diagnosis"].includes(c.status)
  ).length,
  success_rate: 96.5,
};

export function getDemoEndodonticCaseById(
  id: string
): EndodonticCase | undefined {
  return DEMO_ENDODONTIC_CASES.find((c) => c.id === id);
}

export function getDemoEndodonticCasesByPatientId(
  patientId: string
): EndodonticCase[] {
  return DEMO_ENDODONTIC_CASES.filter((c) => c.patient_id === patientId);
}

export function getUpcomingEndodonticVisits(limit = 4): EndodonticVisit[] {
  const visits = DEMO_ENDODONTIC_CASES.flatMap((c) =>
    c.visits.filter((visit) => visit.status === "scheduled")
  ).sort(
    (a, b) =>
      new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()
  );

  return visits.slice(0, limit);
}
