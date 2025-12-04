'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { DEMO_TREATMENT_PLANS } from '@/lib/demo/cosmetic-mock-data';
import { TREATMENT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/types/cosmetic';

export default function TreatmentsPage() {
  const activeTreatments = DEMO_TREATMENT_PLANS.filter(p => p.status === 'in_progress');
  const completedTreatments = DEMO_TREATMENT_PLANS.filter(p => p.status === 'completed');
  const plannedTreatments = DEMO_TREATMENT_PLANS.filter(p => p.status === 'planned');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-pink-500" />
            治疗方案
          </h1>
          <p className="text-muted-foreground mt-1">
            管理和追踪美容治疗项目进度
          </p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Sparkles className="mr-2 h-4 w-4" />
          新建方案
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTreatments.length}</div>
            <p className="text-xs text-muted-foreground">平均进度 55%</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTreatments.length}</div>
            <p className="text-xs text-muted-foreground">本月完成 1 个</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已规划</CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plannedTreatments.length}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总治疗数</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {DEMO_TREATMENT_PLANS.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Treatments */}
      {activeTreatments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            进行中的治疗
          </h2>
          {activeTreatments.map(treatment => (
            <TreatmentCard key={treatment.id} treatment={treatment} />
          ))}
        </div>
      )}

      {/* Completed Treatments */}
      {completedTreatments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            已完成的治疗
          </h2>
          {completedTreatments.map(treatment => (
            <TreatmentCard key={treatment.id} treatment={treatment} />
          ))}
        </div>
      )}

      {/* Planned Treatments */}
      {plannedTreatments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            计划中的治疗
          </h2>
          {plannedTreatments.map(treatment => (
            <TreatmentCard key={treatment.id} treatment={treatment} />
          ))}
        </div>
      )}
    </div>
  );
}

function TreatmentCard({ treatment }: { treatment: any }) {
  const completedSteps = treatment.steps.filter((s: any) => s.completed).length;
  const patientHubUrl = `/dashboard/patients/${treatment.patient_id}?tab=cosmetic&context=cosmetic`;

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
                  className="hover:text-pink-600 transition-colors"
                >
                  {treatment.patient_name}
                </Link>
              </h3>
              <Badge
                variant="secondary"
                className={`bg-${STATUS_COLORS[treatment.status]}-100 text-${STATUS_COLORS[treatment.status]}-700`}
              >
                {STATUS_LABELS[treatment.status]}
              </Badge>
              <Badge variant="outline" className="bg-pink-50 text-pink-700">
                {TREATMENT_TYPE_LABELS[treatment.treatment_type]}
              </Badge>
            </div>

            <p className="text-base font-medium">{treatment.treatment_name}</p>
            <p className="text-muted-foreground text-sm">{treatment.description}</p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  治疗进度：{completedSteps} / {treatment.steps.length} 步骤已完成
                </span>
                <span className="font-medium">{treatment.progress_percentage}%</span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${treatment.progress_percentage}%` }}
                />
              </div>
            </div>

            {/* Timeline */}
            {treatment.start_date && (
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">开始日期：</span>
                  <span className="ml-1">{new Date(treatment.start_date).toLocaleDateString('zh-CN')}</span>
                </div>
                {treatment.expected_completion && (
                  <div>
                    <span className="text-muted-foreground">预计完成：</span>
                    <span className="ml-1">{new Date(treatment.expected_completion).toLocaleDateString('zh-CN')}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">总就诊次数：</span>
                  <span className="ml-1">{treatment.total_visits} 次</span>
                </div>
              </div>
            )}

          </div>

          {/* Side Info */}
          <div className="text-right space-y-3 ml-6">
            <div>
              <p className="text-sm text-muted-foreground">治疗类型</p>
              <p className="text-lg font-medium text-pink-600">
                {TREATMENT_TYPE_LABELS[treatment.treatment_type]}
              </p>
            </div>

            <div className="space-y-2">
              <Link href={patientHubUrl}>
                <Button variant="ghost" size="sm" className="w-full justify-center text-pink-600 hover:text-pink-700">
                  查看病人
                </Button>
              </Link>
              <Link href={`/dashboard/cosmetic/consultations/${treatment.consultation_id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  查看咨询详情
                </Button>
              </Link>
            </div>

            {treatment.status === 'in_progress' && (
              <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600">
                更新进度
              </Button>
            )}

            {treatment.status === 'completed' && (
              <Link href={`/dashboard/cosmetic/before-after?treatment=${treatment.id}`}>
                <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">
                  查看效果对比
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Photos Preview */}
        {(treatment.before_photos?.length > 0 || treatment.after_photos?.length > 0) && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex gap-4">
              {treatment.before_photos?.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">治疗前</p>
                  <div className="flex gap-2">
                    {treatment.before_photos.slice(0, 2).map((photo: string, idx: number) => (
                      <div key={idx} className="w-16 h-16 rounded overflow-hidden border">
                        <img src={photo} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {treatment.after_photos?.length > 0 && (
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">治疗后</p>
                  <div className="flex gap-2">
                    {treatment.after_photos.slice(0, 2).map((photo: string, idx: number) => (
                      <div key={idx} className="w-16 h-16 rounded overflow-hidden border">
                        <img src={photo} alt="After" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
