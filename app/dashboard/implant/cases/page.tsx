'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { DEMO_IMPLANT_CASES } from '@/lib/demo/implant-mock-data';
import {
  STAGE_LABELS,
  TYPE_LABELS,
  BRAND_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  getStageColor,
} from '@/lib/types/implant';

export default function ImplantCasesPage() {
  const activeCases = DEMO_IMPLANT_CASES.filter(c => c.status === 'in_progress' || c.status === 'planned');
  const completedCases = DEMO_IMPLANT_CASES.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8 text-purple-500" />
            种植案例
          </h1>
          <p className="text-muted-foreground mt-1">
            管理所有种植牙案例和进度
          </p>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Calendar className="mr-2 h-4 w-4" />
          新建案例
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃案例</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总种植体</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {DEMO_IMPLANT_CASES.reduce((sum, c) => sum + c.implant_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cases */}
      {activeCases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">活跃案例</h2>
          {activeCases.map(implantCase => (
            <ImplantCaseCard key={implantCase.id} implantCase={implantCase} />
          ))}
        </div>
      )}

      {/* Completed Cases */}
      {completedCases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">已完成案例</h2>
          {completedCases.map(implantCase => (
            <ImplantCaseCard key={implantCase.id} implantCase={implantCase} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImplantCaseCard({ implantCase }: { implantCase: any }) {
  const currentTimeline = implantCase.timeline.find((t: any) => t.status === 'current');
  const patientHubUrl = `/dashboard/patients/${implantCase.patient_id}?tab=implant&context=implant`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Main Info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">
                <Link
                  href={patientHubUrl}
                  className="hover:text-purple-600 transition-colors"
                >
                  {implantCase.patient_name}
                </Link>
              </h3>
              <Badge
                variant="secondary"
                className={`bg-${STATUS_COLORS[implantCase.status]}-100 text-${STATUS_COLORS[implantCase.status]}-700`}
              >
                {STATUS_LABELS[implantCase.status]}
              </Badge>
              <Badge variant="outline" className="bg-purple-50">
                {TYPE_LABELS[implantCase.case_type]}
              </Badge>
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">种植体品牌：</span>
                <span className="ml-1 font-medium">{BRAND_LABELS[implantCase.implant_brand]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">数量：</span>
                <span className="ml-1 font-medium">{implantCase.implant_count} 颗</span>
              </div>
              <div>
                <span className="text-muted-foreground">牙位：</span>
                <span className="ml-1 font-medium">{implantCase.tooth_positions.join(', ')}</span>
              </div>
            </div>

            {/* Current Stage */}
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`bg-${getStageColor(implantCase.current_stage)}-100 text-${getStageColor(implantCase.current_stage)}-700`}
              >
                {STAGE_LABELS[implantCase.current_stage]}
              </Badge>
              {currentTimeline?.notes && (
                <span className="text-sm text-muted-foreground">{currentTimeline.notes}</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">整体进度</span>
                <span className="font-medium">{implantCase.progress_percentage}%</span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${implantCase.progress_percentage}%` }}
                />
              </div>
            </div>

            {/* Timeline Preview */}
            <div className="flex gap-2 pt-2">
              {implantCase.timeline.slice(0, 5).map((stage: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex-1 h-2 rounded ${
                    stage.status === 'completed'
                      ? 'bg-green-500'
                      : stage.status === 'current'
                      ? 'bg-purple-500'
                      : 'bg-gray-200'
                  }`}
                  title={stage.stage_name}
                />
              ))}
            </div>

            {/* Dates */}
            {(implantCase.consultation_date || implantCase.expected_completion) && (
              <div className="flex gap-6 text-sm pt-2">
                {implantCase.consultation_date && (
                  <div>
                    <span className="text-muted-foreground">初诊：</span>
                    <span className="ml-1">{new Date(implantCase.consultation_date).toLocaleDateString('zh-CN')}</span>
                  </div>
                )}
                {implantCase.surgery_date && (
                  <div>
                    <span className="text-muted-foreground">手术：</span>
                    <span className="ml-1">{new Date(implantCase.surgery_date).toLocaleDateString('zh-CN')}</span>
                  </div>
                )}
                {implantCase.expected_completion && (
                  <div>
                    <span className="text-muted-foreground">预计完成：</span>
                    <span className="ml-1">{new Date(implantCase.expected_completion).toLocaleDateString('zh-CN')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Bone Quality */}
            {implantCase.bone_quality && (
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">骨质：</span>
                  <span className="ml-1">{implantCase.bone_quality}</span>
                </div>
                {implantCase.bone_grafting_needed && (
                  <Badge variant="outline" className="text-xs">需要植骨</Badge>
                )}
                {implantCase.sinus_lift_needed && (
                  <Badge variant="outline" className="text-xs">需要上颌窦提升</Badge>
                )}
              </div>
            )}
          </div>

          {/* Side Info */}
          <div className="text-right space-y-3 ml-6">
            <div>
              <p className="text-sm text-muted-foreground">主刀医生</p>
              <p className="text-lg font-medium text-purple-600">
                {implantCase.surgeon_name || '未指定'}
              </p>
            </div>

            <div className="text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">种植品牌：</span>
                <span className="ml-1 font-medium">{BRAND_LABELS[implantCase.implant_brand]}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link href={patientHubUrl}>
                <Button variant="ghost" size="sm" className="w-full justify-center text-purple-600 hover:text-purple-700">
                  查看病人
                </Button>
              </Link>
              <Link href={`/dashboard/implant/cases/${implantCase.id}`}>
                <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600">
                  查看详情
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Images Preview */}
        {(implantCase.photos?.length > 0 || implantCase.cbct_scans?.length > 0) && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex gap-2">
              {implantCase.cbct_scans?.slice(0, 2).map((scan: string, idx: number) => (
                <div key={idx} className="w-20 h-20 rounded overflow-hidden border">
                  <img src={scan} alt="CBCT" className="w-full h-full object-cover" />
                </div>
              ))}
              {implantCase.photos?.slice(0, 2).map((photo: string, idx: number) => (
                <div key={idx} className="w-20 h-20 rounded overflow-hidden border">
                  <img src={photo} alt="Photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
