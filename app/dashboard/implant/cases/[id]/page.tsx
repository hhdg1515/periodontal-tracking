'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, Clock, Circle, DollarSign, Image, FileText } from 'lucide-react';
import Link from 'next/link';
import { getDemoImplantCaseById } from '@/lib/demo/implant-mock-data';
import {
  STAGE_LABELS,
  TYPE_LABELS,
  BRAND_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  getStageColor,
} from '@/lib/types/implant';

export default function ImplantCaseDetailPage() {
  const params = useParams();
  const baseCase = getDemoImplantCaseById(params.id as string);

  const [caseData, setCaseData] = useState(baseCase);

  if (!caseData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">案例未找到</p>
      </div>
    );
  }

  const stageOptions = [
    { value: 'planning', label: '手术规划' },
    { value: 'surgery', label: '手术植入' },
    { value: 'healing', label: '愈合期' },
    { value: 'restoration', label: '最终修复' },
  ] as const;
  const progressMap: Record<string, number> = {
    planning: 25,
    surgery: 50,
    healing: 75,
    restoration: 100,
  };

  const handleStageChange = (nextStage: string) => {
    setCaseData((prev: any) => {
      if (!prev) return prev;
      const updatedTimeline = prev.timeline.map((item: any) => {
        if (item.stage === nextStage) return { ...item, status: 'current' };
        const stageOrder = stageOptions.map(s => s.value);
        const currentIdx = stageOrder.indexOf(nextStage);
        const itemIdx = stageOrder.indexOf(item.stage);
        if (itemIdx !== -1) {
          if (itemIdx < currentIdx) return { ...item, status: 'completed' };
          if (itemIdx > currentIdx) return { ...item, status: 'upcoming' };
        }
        return item;
      });
      const progressMap: Record<string, number> = {
        planning: 25,
        surgery: 50,
        healing: 75,
        restoration: 100,
      };
      return {
        ...prev,
        current_stage: nextStage,
        timeline: updatedTimeline,
        progress_percentage: progressMap[nextStage] ?? prev.progress_percentage,
      };
    });
  };

  const handleTimelineChange = (stageValue: string, changes: any) => {
    setCaseData((prev: any) => {
      if (!prev) return prev;
      const updatedTimeline = prev.timeline.map((item: any) => {
        if (item.stage !== stageValue) {
          if (changes.status === 'current' && item.status === 'current') {
            return { ...item, status: 'completed' };
          }
          return item;
        }
        return { ...item, ...changes };
      });
      const next: any = { ...prev, timeline: updatedTimeline };
      if (changes.status === 'current') {
        next.current_stage = stageValue;
        next.progress_percentage = progressMap[stageValue] ?? prev.progress_percentage;
      }
      return next;
    });
  };

  const formatDateInput = (value?: string) => {
    if (!value) return '';
    const iso = new Date(value).toISOString();
    return iso.slice(0, 10);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/implant/cases">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{caseData.patient_name}</h1>
          <p className="text-muted-foreground">种植案例详情</p>
        </div>
        <Badge
          variant="secondary"
          className={`bg-${STATUS_COLORS[caseData.status]}-100 text-${STATUS_COLORS[caseData.status]}-700`}
        >
          {STATUS_LABELS[caseData.status]}
        </Badge>
        <Link href={`/dashboard/patients/${caseData.patient_id}?tab=implant&context=implant`}>
          <Button variant="outline">查看病人</Button>
        </Link>
        <select
          className="text-sm border rounded-md px-2 py-1"
          value={caseData.current_stage}
          onChange={(e) => handleStageChange(e.target.value)}
          aria-label="选择当前阶段"
        >
          {stageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>案例信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">案例类型</p>
                  <p className="font-medium">{TYPE_LABELS[caseData.case_type]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">种植体品牌</p>
                  <p className="font-medium">{BRAND_LABELS[caseData.implant_brand]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">种植数量</p>
                  <p className="font-medium">{caseData.implant_count} 颗</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">牙位</p>
                  <p className="font-medium">{caseData.tooth_positions.join(', ')}</p>
                </div>
              </div>

              {caseData.surgeon_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">主刀医生</p>
                  <p className="font-medium">{caseData.surgeon_name}</p>
                </div>
              )}

              {/* Bone Quality */}
              {caseData.bone_quality && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">骨质评估</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{caseData.bone_quality}</Badge>
                    {caseData.bone_grafting_needed && (
                      <Badge variant="outline" className="bg-yellow-50">需要植骨</Badge>
                    )}
                    {caseData.sinus_lift_needed && (
                      <Badge variant="outline" className="bg-orange-50">需要上颌窦提升</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>治疗时间线</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {caseData.timeline.map((stage: any, idx: number) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';
                  const isUpcoming = stage.status === 'upcoming';

                  return (
                    <div key={idx} className="flex gap-4">
                      {/* Icon */}
                      <div className="flex flex-col items-center">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : isCurrent ? (
                          <Clock className="h-6 w-6 text-purple-500 animate-pulse" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-300" />
                        )}
                        {idx < caseData.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{stage.stage_name}</h4>
                          <Badge
                            variant="secondary"
                            className={`
                              ${isCompleted ? 'bg-green-100 text-green-700' : ''}
                              ${isCurrent ? 'bg-purple-100 text-purple-700' : ''}
                              ${isUpcoming ? 'bg-gray-100 text-gray-700' : ''}
                            `}
                          >
                            {isCompleted ? '已完成' : isCurrent ? '进行中' : '待进行'}
                          </Badge>
                        </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1">
                      <span className="block text-xs text-gray-500">计划日期</span>
                      <Input
                        type="date"
                        value={formatDateInput(stage.planned_date)}
                        onChange={(e) =>
                          handleTimelineChange(stage.stage, { planned_date: e.target.value })
                        }
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="block text-xs text-gray-500">实际日期</span>
                      <Input
                        type="date"
                        value={formatDateInput(stage.actual_date)}
                        onChange={(e) =>
                          handleTimelineChange(stage.stage, { actual_date: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  {stage.duration_weeks && (
                    <p>预计时长: {stage.duration_weeks} 周</p>
                  )}
                  <div className="space-y-1">
                    <span className="block text-xs text-gray-500">状态</span>
                    <select
                      className="text-sm border rounded-md px-2 py-1"
                      value={stage.status}
                      onChange={(e) =>
                        handleTimelineChange(stage.stage, { status: e.target.value })
                      }
                    >
                      <option value="completed">已完成</option>
                      <option value="current">进行中</option>
                      <option value="upcoming">待进行</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs text-gray-500">备注</span>
                    <textarea
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                      rows={2}
                      value={stage.notes || ''}
                      onChange={(e) =>
                        handleTimelineChange(stage.stage, { notes: e.target.value })
                      }
                      placeholder="填写规划/术中要点"
                    />
                  </div>
                </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          {(caseData.cbct_scans?.length > 0 || caseData.photos?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  影像资料
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseData.cbct_scans?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">CBCT 扫描</p>
                    <div className="grid grid-cols-2 gap-4">
                      {caseData.cbct_scans.map((scan: string, idx: number) => (
                        <div
                          key={idx}
                          className="aspect-video rounded-lg overflow-hidden border"
                        >
                          <img
                            src={scan}
                            alt={`CBCT ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {caseData.photos?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">临床照片</p>
                    <div className="grid grid-cols-3 gap-4">
                      {caseData.photos.map((photo: string, idx: number) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-lg overflow-hidden border"
                        >
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {caseData.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  临床备注
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{caseData.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle>治疗进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {caseData.progress_percentage}%
                </div>
                <p className="text-sm text-muted-foreground">整体完成度</p>
              </div>

              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${caseData.progress_percentage}%` }}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">当前阶段</span>
                  <span className="font-medium">{STAGE_LABELS[caseData.current_stage]}</span>
                </div>
                {caseData.expected_completion && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">预计完成</span>
                    <span className="font-medium">
                      {new Date(caseData.expected_completion).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                更新进度
              </Button>
              <Button variant="outline" className="w-full">
                上传图片
              </Button>
              <Button variant="outline" className="w-full">
                记录并发症
              </Button>
              <Button variant="outline" className="w-full">
                打印报告
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
