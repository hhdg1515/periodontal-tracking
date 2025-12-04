'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, DollarSign, Clock, User, FileText, Image, CheckCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getDemoConsultationById, DEMO_TREATMENT_PLANS, getDemoBeforeAfterByTreatmentId } from '@/lib/demo/cosmetic-mock-data';
import { TREATMENT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/types/cosmetic';

export default function ConsultationDetailPage() {
  const params = useParams();
  const consultation = getDemoConsultationById(params.id as string);

  // 查找关联的治疗方案
  const relatedTreatmentPlan = consultation
    ? DEMO_TREATMENT_PLANS.find(p => p.consultation_id === consultation.id)
    : null;

  // 查找效果对比照片
  const beforeAfterPhotos = relatedTreatmentPlan
    ? getDemoBeforeAfterByTreatmentId(relatedTreatmentPlan.id)
    : [];

  // 判断是否已完成
  const isCompleted = consultation?.status === 'completed' && relatedTreatmentPlan?.status === 'completed';

  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">咨询记录未找到</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/cosmetic/consultations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{consultation.patient_name}</h1>
          <p className="text-muted-foreground">美容咨询详情</p>
        </div>
        <Badge
          variant="secondary"
          className={`bg-${STATUS_COLORS[consultation.status]}-100 text-${STATUS_COLORS[consultation.status]}-700`}
        >
          {STATUS_LABELS[consultation.status]}
        </Badge>
        <Button className="bg-pink-500 hover:bg-pink-600">创建治疗方案</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>咨询信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">咨询日期</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-pink-500" />
                    {new Date(consultation.consultation_date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">患者 ID</p>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-pink-500" />
                    {consultation.patient_id}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">期望效果</p>
                <p className="text-base">{consultation.desired_outcome}</p>
              </div>

              {consultation.concerns.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">主要关注点</p>
                  <div className="flex gap-2 flex-wrap">
                    {consultation.concerns.map((concern, idx) => (
                      <Badge key={idx} variant="outline">
                        {concern}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shade Analysis */}
          {consultation.current_shade && (
            <Card>
              <CardHeader>
                <CardTitle>色阶评估</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">当前色阶</p>
                    <div className="h-16 rounded-lg border-2 bg-gradient-to-r from-yellow-100 to-yellow-200 flex items-center justify-center">
                      <span className="text-2xl font-bold">{consultation.current_shade}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">目标色阶</p>
                    <div className="h-16 rounded-lg border-2 bg-gradient-to-r from-white to-gray-50 flex items-center justify-center">
                      <span className="text-2xl font-bold">{consultation.desired_shade}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Smile Analysis */}
          {consultation.smile_analysis && (
            <Card>
              <CardHeader>
                <CardTitle>笑容分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{consultation.smile_analysis}</p>
              </CardContent>
            </Card>
          )}

          {/* Before Photos */}
          {consultation.before_photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  初诊照片
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {consultation.before_photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="aspect-video rounded-lg overflow-hidden border"
                    >
                      <img
                        src={photo}
                        alt={`Before photo ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Treatment Summary - 治疗完成总结 */}
          {isCompleted && relatedTreatmentPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  治疗完成总结
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">治疗方案</p>
                  <p className="font-medium">{relatedTreatmentPlan.treatment_name}</p>
                  <p className="text-sm text-muted-foreground">{relatedTreatmentPlan.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">开始日期</p>
                    <p className="font-medium">
                      {relatedTreatmentPlan.start_date &&
                        new Date(relatedTreatmentPlan.start_date).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">完成日期</p>
                    <p className="font-medium">
                      {relatedTreatmentPlan.actual_completion_date
                        ? new Date(relatedTreatmentPlan.actual_completion_date).toLocaleDateString('zh-CN')
                        : '已完成'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">总就诊次数</p>
                    <p className="font-medium">{relatedTreatmentPlan.total_visits} 次</p>
                  </div>
                </div>

                {relatedTreatmentPlan.patient_satisfaction && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">患者满意度</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${relatedTreatmentPlan.patient_satisfaction * 10}%` }}
                        />
                      </div>
                      <span className="font-medium text-green-600">
                        {relatedTreatmentPlan.patient_satisfaction}/10
                      </span>
                    </div>
                  </div>
                )}

                {relatedTreatmentPlan.treatment_summary && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-2">治疗总结</p>
                    <p className="text-base">{relatedTreatmentPlan.treatment_summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Before/After Comparison - 效果对比 */}
          {isCompleted && beforeAfterPhotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  治疗效果对比
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {beforeAfterPhotos.map((comparison, idx) => (
                  <div key={comparison.id} className="space-y-4">
                    {/* 标题 */}
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {comparison.angle === 'front' ? '正面' :
                         comparison.angle === 'side' ? '侧面' :
                         comparison.angle === 'smile' ? '笑容' : '特写'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comparison.after_date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>

                    {/* Before/After 对比 */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-center">治疗前</p>
                        <div className="aspect-video rounded-lg overflow-hidden border-2 border-red-200">
                          <img
                            src={comparison.before_photo}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {new Date(comparison.before_date).toLocaleDateString('zh-CN')}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-center">治疗后</p>
                        <div className="aspect-video rounded-lg overflow-hidden border-2 border-green-200">
                          <img
                            src={comparison.after_photo}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {new Date(comparison.after_date).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>

                    {/* 显著改善 */}
                    {comparison.visible_improvements && comparison.visible_improvements.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">显著改善：</p>
                        <div className="flex flex-wrap gap-2">
                          {comparison.visible_improvements.map((improvement, impIdx) => (
                            <Badge key={impIdx} variant="outline" className="bg-green-50 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 分隔线（如果有多组对比） */}
                    {idx < beforeAfterPhotos.length - 1 && (
                      <hr className="my-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {consultation.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  医生备注
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{consultation.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommended Treatments */}
          <Card>
            <CardHeader>
              <CardTitle>推荐治疗</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {consultation.recommended_treatments.map(treatment => (
                <div
                  key={treatment}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <p className="font-medium">{TREATMENT_TYPE_LABELS[treatment]}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Estimates */}
          <Card>
            <CardHeader>
              <CardTitle>费用和时间</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultation.estimated_cost && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    预计费用
                  </p>
                  <p className="text-2xl font-bold text-pink-600">
                    ¥{consultation.estimated_cost.toLocaleString()}
                  </p>
                </div>
              )}

              {consultation.estimated_duration && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    预计疗程
                  </p>
                  <p className="text-lg font-medium">{consultation.estimated_duration}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!isCompleted && (
                <Button className="w-full bg-pink-500 hover:bg-pink-600">
                  创建治疗方案
                </Button>
              )}
              <Button variant="outline" className="w-full">
                编辑咨询记录
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
