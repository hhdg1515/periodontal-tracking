'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Wrench, FileText, ArrowLeft, Layers } from 'lucide-react';
import { DEMO_IMPLANT_CASES } from '@/lib/demo/implant-mock-data';
import { STAGE_LABELS, TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, getStageColor } from '@/lib/types/implant';

export default function ImplantPlanningPage() {
  const planningCases = DEMO_IMPLANT_CASES.filter(
    (c) => c.current_stage === 'planning' || c.status === 'planned',
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Layers className="h-8 w-8 text-purple-500" />
            种植手术规划
          </h1>
          <p className="text-muted-foreground mt-1">
            汇总需要 CBCT / 导板规划的案例，快速进入详情
          </p>
        </div>
        <Link href="/dashboard/implant">
          <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回种植总览
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>待规划案例</CardTitle>
          <CardDescription>当前阶段在“手术规划”或状态为“计划中”的案例</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {planningCases.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              暂无待规划的案例。
            </p>
          )}

          {planningCases.map((implantCase) => {
            const patientHubUrl = `/dashboard/patients/${implantCase.patient_id}?tab=implant&context=implant`;
            return (
              <div key={implantCase.id} className="rounded-2xl border p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{implantCase.patient_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {TYPE_LABELS[implantCase.case_type]} · {implantCase.implant_count} 颗 · 牙位 {implantCase.tooth_positions.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`bg-${STATUS_COLORS[implantCase.status]}-100 text-${STATUS_COLORS[implantCase.status]}-700`}>
                      {STATUS_LABELS[implantCase.status]}
                    </Badge>
                    <Badge variant="outline" className={`text-${getStageColor(implantCase.current_stage)}-700`}>
                      {STAGE_LABELS[implantCase.current_stage]}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {implantCase.timeline.find(t => t.stage === 'planning')?.planned_date && (
                    <span>
                      计划日期：{new Date(implantCase.timeline.find(t => t.stage === 'planning')!.planned_date!).toLocaleDateString('zh-CN')}
                    </span>
                  )}
                  {implantCase.expected_completion && (
                    <span>预计完成：{new Date(implantCase.expected_completion).toLocaleDateString('zh-CN')}</span>
                  )}
                  {implantCase.surgeon_name && <span>医生：{implantCase.surgeon_name}</span>}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 rounded-full bg-purple-500 transition-all"
                      style={{ width: `${implantCase.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{implantCase.progress_percentage}%</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/implant/cases/${implantCase.id}`}>
                    <Button size="sm">查看案例</Button>
                  </Link>
                  <Link href={patientHubUrl}>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                      病人档案
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
