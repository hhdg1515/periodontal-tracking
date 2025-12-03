"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  ArrowRight,
  Search,
  AlertTriangle,
} from "lucide-react";
import { ClinicalGuidelinesPanel } from "@/components/clinical/clinical-guidelines-panel";
import { XRayComparisonViewer } from "@/components/comparison/xray-comparison-viewer";
import { AnalysisPanel } from "@/components/comparison/analysis-panel";
import { ClinicalAssessment } from "@/lib/types/clinical";
import {
  DEMO_PATIENTS,
  DEMO_VISITS,
  DEMO_XRAYS,
  DEMO_PERIODONTAL_CHARTS,
} from "@/lib/demo/mock-data";

const DEMO_ASSESSMENTS: Record<string, ClinicalAssessment> = {
  "visit-002": {
    id: "assessment-demo-002",
    visit_id: "visit-002",
    assessment_date: "2024-11-15T10:00:00Z",
    spontaneous_pain: false,
    thermal_sensitivity: "mild",
    percussion_sensitivity: "mild",
    palpation_tenderness: true,
    swelling: false,
    sinus_tract: false,
    pulp_vitality_cold: "positive",
    pulp_vitality_electric: "not_tested",
    percussion_test: "sensitive",
    mobility_grade: "grade_1",
    pocket_depth_max: 6,
    attachment_loss_max: 4,
    bleeding_on_probing: true,
    furcation_involvement: "grade_1",
    periodontal_chart: DEMO_PERIODONTAL_CHARTS["visit-002"] || [],
    perio_status: "moderate",
    endo_concern: "suspected",
    combined_lesion: false,
    requires_endo_evaluation: false,
    requires_perio_treatment: true,
    requires_specialist_referral: false,
    referral_specialty: null,
    clinical_notes: "Posterior sextant exhibits persistent bleeding despite SRP.",
    differential_diagnosis: "Chronic periodontitis with possible combined lesion.",
    created_by: "Dr. Zhang",
    created_at: "2024-11-15T12:00:00Z",
    updated_at: "2024-11-15T12:00:00Z",
  },
};

export default function PeriodontalTrackingPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const selectedPatient = useMemo(
    () => DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || null,
    [selectedPatientId]
  );
  const selectedVisit = useMemo(
    () => DEMO_VISITS.find((v) => v.id === selectedVisitId) || null,
    [selectedVisitId]
  );
  const selectedAssessment =
    (selectedVisitId && DEMO_ASSESSMENTS[selectedVisitId]) || null;

  const measurementHighlights = useMemo(() => {
    if (!selectedVisitId) return [];
    return (DEMO_PERIODONTAL_CHARTS[selectedVisitId] || []).slice(0, 4);
  }, [selectedVisitId]);

  const totalPatients = DEMO_PATIENTS.length;
  const totalVisits = DEMO_VISITS.length;
  const totalComparisons = Math.floor(DEMO_XRAYS.length / 2);
  const showDetail = Boolean(selectedPatient && selectedVisit);

  const caseOptions = DEMO_VISITS.slice(0, 6).map((visit) => {
    const patient = DEMO_PATIENTS.find((p) => p.id === visit.patientId);
    return {
      visitId: visit.id,
      patientId: visit.patientId,
      name: `${patient?.firstName} ${patient?.lastName}`,
      note: visit.notes,
      date: format(visit.visitDate, "yyyy-MM-dd"),
    };
  });

  const highRiskCases = [
    {
      patientId: "demo-001",
      name: "Sarah Johnson",
      stage: "维护期 · 6mm",
      nextVisit: "2024-12-20",
      trend: "-0.4mm 骨质流失",
      badge: "SRP + AI 监测",
    },
    {
      patientId: "demo-002",
      name: "Michael Chen",
      stage: "复诊 · 5mm",
      nextVisit: "2024-12-18",
      trend: "+1.2mm 牙龈改善",
      badge: "待比较 X 光",
    },
    {
      patientId: "demo-003",
      name: "Emily Rodriguez",
      stage: "基线评估",
      nextVisit: "2025-01-05",
      trend: "预估 SRP",
      badge: "初诊教育",
    },
  ];

  const followUps = DEMO_VISITS.slice(0, 4).map((visit) => {
    const patient = DEMO_PATIENTS.find((p) => p.id === visit.patientId);
    return {
      visitId: visit.id,
      patientId: visit.patientId,
      name: `${patient?.firstName} ${patient?.lastName}`,
      date: format(visit.visitDate, "MM月dd日"),
      note: visit.notes,
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">牙周病追踪</h1>
          <p className="text-muted-foreground mt-1">
            先查看概览与提醒，再选择病例进入临床/AI 细节
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            const firstVisit = DEMO_VISITS[0];
            handleCaseSelect(firstVisit.patientId, firstVisit.id);
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          快速载入示例
        </Button>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              活跃患者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              本月回诊率 82%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-500" />
              已记录就诊
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              6 个月内 +24%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              X 光对比分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalComparisons}</div>
            <p className="text-xs text-muted-foreground mt-1">
              AI 标记异常 3 例
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cases + follow-ups */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-white/90 shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>重点关注病例</CardTitle>
              <CardDescription>AI 根据骨质变化与临床参数排序</CardDescription>
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              需复查 3
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {highRiskCases.map((caseItem) => (
              <div
                key={caseItem.patientId}
                className="rounded-2xl bg-white shadow-sm p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-gray-900">{caseItem.name}</p>
                  <p className="text-sm text-muted-foreground">{caseItem.stage}</p>
                  <p className="text-xs text-blue-600 mt-1">{caseItem.trend}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-2">
                    {caseItem.badge}
                  </Badge>
                  <p className="text-xs text-gray-500">下次：{caseItem.nextVisit}</p>
                  <Link
                    href={`/dashboard/patients/${caseItem.patientId}`}
                    className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    查看病人 <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              今日追踪
            </CardTitle>
            <CardDescription>今日需要联络或复诊的病例</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {followUps.map((visit) => (
              <div key={visit.visitId} className="rounded-xl bg-gray-50/80 p-3">
                <p className="font-medium text-gray-900">{visit.name}</p>
                <p className="text-xs text-muted-foreground">{visit.note}</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-gray-500">{visit.date}</span>
                  <Link
                    href={`/dashboard/patients/${visit.patientId}?tab=periodontal`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    打开 <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Case selector */}
      <Card className="bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            病例选择
          </CardTitle>
          <CardDescription>选定病例后才显示临床摘要、AI 对比与指引</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {caseOptions.map((option) => (
            <div
              key={option.visitId}
              className={`rounded-2xl p-4 shadow-sm transition ${
                selectedVisitId === option.visitId
                  ? "bg-blue-50 ring-1 ring-blue-400"
                  : "bg-white hover:bg-blue-50/60"
              }`}
            >
              <p className="text-sm font-semibold text-gray-900">{option.name}</p>
              <p className="text-xs text-muted-foreground">{option.date}</p>
              <p className="text-xs text-gray-500 mt-1">
                {option.note.slice(0, 40)}...
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant={selectedVisitId === option.visitId ? "default" : "outline"}
                  onClick={() => handleCaseSelect(option.patientId, option.visitId)}
                >
                  {selectedVisitId === option.visitId ? "已选中" : "查看分析"}
                </Button>
                <Link href={`/dashboard/patients/${option.patientId}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  病历 <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detail workspace */}
      {showDetail ? (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  临床评估摘要
                </CardTitle>
                <CardDescription>
                  {selectedPatient?.firstName} {selectedPatient?.lastName} · {selectedVisit && format(selectedVisit.visitDate, "yyyy-MM-dd")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                  <SummaryTile label="最大 PD" value={selectedAssessment?.pocket_depth_max ? `${selectedAssessment.pocket_depth_max} mm` : "--"} />
                  <SummaryTile label="最大 CAL" value={selectedAssessment?.attachment_loss_max ? `${selectedAssessment.attachment_loss_max} mm` : "--"} />
                  <SummaryTile label="Bleeding" value={selectedAssessment?.bleeding_on_probing ? "Yes" : "No"} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">重点牙位</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {measurementHighlights.length > 0 ? (
                      measurementHighlights.map((entry) => (
                        <div key={`${entry.tooth}-${entry.surface}`} className="rounded-xl bg-white p-3 shadow-sm flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {entry.tooth} {entry.surface}
                            </p>
                            <p className="text-xs text-gray-500">
                              PD {entry.pocket_depth}mm · CAL {entry.attachment_loss}mm
                            </p>
                          </div>
                          <Badge variant="outline">{entry.priority}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground col-span-2">
                        没有记录的牙周测量。
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/dashboard/patients/${selectedPatientId}?tab=periodontal`}>
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      打开病人档案
                    </Button>
                  </Link>
                  {selectedVisitId && (
                    <Link href={`/dashboard/patients/${selectedPatientId}/visits/${selectedVisitId}`}>
                      <Button size="sm" variant="outline">
                        查看临床评估
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <ClinicalGuidelinesPanel assessment={selectedAssessment} />
              <Card className="bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    建议行动
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  {selectedAssessment ? (
                    <>
                      <p>• 右上象限建议再次 SRP，并加强患教。</p>
                      <p>• 4 周后拍摄对比 X 光，验证 AI 标记区域。</p>
                      <p>• 若 6 个月内 PD 仍 &gt;6mm，考虑手术方案。</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      无临床评估资料，无法生成建议。
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-white/90 shadow-sm">
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI X 光对比</CardTitle>
                    <CardDescription>选择基线与最新影像，快速标记骨质变化</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Beta
                  </Badge>
                </CardHeader>
                <CardContent>
                  <XRayComparisonViewer
                    patientId={selectedPatientId}
                    baselineId={baselineId}
                    currentId={currentId}
                    onSelectBaseline={setBaselineId}
                    onSelectCurrent={setCurrentId}
                  />
                </CardContent>
              </Card>
            </div>
            <Card className="bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  AI 分析摘要
                </CardTitle>
                <CardDescription>骨质变化百分比与关注区域</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalysisPanel baselineId={baselineId} currentId={currentId} />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="bg-white/90 shadow-sm border-dashed border-2 border-gray-200">
          <CardContent className="py-16 text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-gray-400" />
            <p>请选择一个病例后再查看临床重点、AI 指引与 X 光对比。</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function handleCaseSelect(patientId: string, visitId: string) {
    setSelectedPatientId(patientId);
    setSelectedVisitId(visitId);
    const visitIds = DEMO_VISITS.filter((v) => v.patientId === patientId).map(
      (v) => v.id
    );
    const patientXrays = DEMO_XRAYS.filter((x) => visitIds.includes(x.visitId))
      .slice()
      .sort(
        (a, b) =>
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      );
    setBaselineId(patientXrays[0]?.id || null);
    setCurrentId(
      patientXrays.length > 1
        ? patientXrays[patientXrays.length - 1]?.id || null
        : patientXrays[0]?.id || null
    );
  }
}

function SummaryTile({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">
        {value ?? "--"}
      </p>
    </div>
  );
}
