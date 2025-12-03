'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const implantCase = getDemoImplantCaseById(params.id as string);

  if (!implantCase) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">案例未找到</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">{implantCase.patient_name}</h1>
          <p className="text-muted-foreground">种植案例详情</p>
        </div>
        <Badge
          variant="secondary"
          className={`bg-${STATUS_COLORS[implantCase.status]}-100 text-${STATUS_COLORS[implantCase.status]}-700`}
        >
          {STATUS_LABELS[implantCase.status]}
        </Badge>
        <Link href={`/dashboard/patients/${implantCase.patient_id}?tab=implant&context=implant`}>
          <Button variant="outline">查看病人</Button>
        </Link>
        <Button className="bg-purple-500 hover:bg-purple-600">更新进度</Button>
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
                  <p className="font-medium">{TYPE_LABELS[implantCase.case_type]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">种植体品牌</p>
                  <p className="font-medium">{BRAND_LABELS[implantCase.implant_brand]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">种植数量</p>
                  <p className="font-medium">{implantCase.implant_count} 颗</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">牙位</p>
                  <p className="font-medium">{implantCase.tooth_positions.join(', ')}</p>
                </div>
              </div>

              {implantCase.surgeon_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">主刀医生</p>
                  <p className="font-medium">{implantCase.surgeon_name}</p>
                </div>
              )}

              {/* Bone Quality */}
              {implantCase.bone_quality && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">骨质评估</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{implantCase.bone_quality}</Badge>
                    {implantCase.bone_grafting_needed && (
                      <Badge variant="outline" className="bg-yellow-50">需要植骨</Badge>
                    )}
                    {implantCase.sinus_lift_needed && (
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
                {implantCase.timeline.map((stage: any, idx: number) => {
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
                        {idx < implantCase.timeline.length - 1 && (
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

                        <div className="text-sm text-muted-foreground space-y-1">
                          {stage.planned_date && (
                            <p>
                              计划日期: {new Date(stage.planned_date).toLocaleDateString('zh-CN')}
                            </p>
                          )}
                          {stage.actual_date && (
                            <p>
                              实际日期: {new Date(stage.actual_date).toLocaleDateString('zh-CN')}
                            </p>
                          )}
                          {stage.duration_weeks && (
                            <p>预计时长: {stage.duration_weeks} 周</p>
                          )}
                          {stage.notes && (
                            <p className="text-base mt-2">{stage.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          {(implantCase.cbct_scans?.length > 0 || implantCase.photos?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  影像资料
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {implantCase.cbct_scans?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">CBCT 扫描</p>
                    <div className="grid grid-cols-2 gap-4">
                      {implantCase.cbct_scans.map((scan: string, idx: number) => (
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

                {implantCase.photos?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">临床照片</p>
                    <div className="grid grid-cols-3 gap-4">
                      {implantCase.photos.map((photo: string, idx: number) => (
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
          {implantCase.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  临床备注
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{implantCase.notes}</p>
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
                  {implantCase.progress_percentage}%
                </div>
                <p className="text-sm text-muted-foreground">整体完成度</p>
              </div>

              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${implantCase.progress_percentage}%` }}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">当前阶段</span>
                  <span className="font-medium">{STAGE_LABELS[implantCase.current_stage]}</span>
                </div>
                {implantCase.expected_completion && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">预计完成</span>
                    <span className="font-medium">
                      {new Date(implantCase.expected_completion).toLocaleDateString('zh-CN')}
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
