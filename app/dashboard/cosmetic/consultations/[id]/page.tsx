'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, DollarSign, Clock, User, FileText, Image } from 'lucide-react';
import Link from 'next/link';
import { getDemoConsultationById } from '@/lib/demo/cosmetic-mock-data';
import { TREATMENT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/types/cosmetic';

export default function ConsultationDetailPage() {
  const params = useParams();
  const consultation = getDemoConsultationById(params.id as string);

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
              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                创建治疗方案
              </Button>
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
