'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Sparkles, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import { DEMO_CONSULTATIONS } from '@/lib/demo/cosmetic-mock-data';
import { TREATMENT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/types/cosmetic';

export default function ConsultationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConsultations = DEMO_CONSULTATIONS.filter(c =>
    c.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.desired_outcome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-pink-500" />
            美容咨询
          </h1>
          <p className="text-muted-foreground mt-1">
            管理患者美容咨询记录和治疗建议
          </p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Calendar className="mr-2 h-4 w-4" />
          新建咨询
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索患者姓名或期望效果..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">筛选</Button>
            <Button variant="outline">排序</Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总咨询数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_CONSULTATIONS.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月新增</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待完成</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {DEMO_CONSULTATIONS.filter(c => c.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预计收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{DEMO_CONSULTATIONS.reduce((sum, c) => sum + (c.estimated_cost || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">没有找到匹配的咨询记录</p>
            </CardContent>
          </Card>
        ) : (
          filteredConsultations.map(consultation => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* Main Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">
                        <Link
                          href={`/dashboard/patients/${consultation.patient_id}?tab=cosmetic&context=cosmetic`}
                          className="hover:text-pink-600 transition-colors"
                        >
                          {consultation.patient_name}
                        </Link>
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`bg-${STATUS_COLORS[consultation.status]}-100 text-${STATUS_COLORS[consultation.status]}-700`}
                      >
                        {STATUS_LABELS[consultation.status]}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground">
                      <strong>期望效果：</strong>
                      {consultation.desired_outcome}
                    </p>

                    {consultation.concerns.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">主要关注点：</p>
                        <div className="flex gap-2 flex-wrap">
                          {consultation.concerns.map((concern, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {concern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {consultation.recommended_treatments.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">推荐治疗：</p>
                        <div className="flex gap-2 flex-wrap">
                          {consultation.recommended_treatments.map(treatment => (
                            <Badge
                              key={treatment}
                              variant="secondary"
                              className="bg-pink-100 text-pink-700"
                            >
                              {TREATMENT_TYPE_LABELS[treatment]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {consultation.current_shade && consultation.desired_shade && (
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">当前色阶：</span>
                          <span className="ml-2 font-medium">{consultation.current_shade}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">目标色阶：</span>
                          <span className="ml-2 font-medium">{consultation.desired_shade}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Side Info */}
                  <div className="text-right space-y-2 ml-6">
                    <div className="text-sm text-muted-foreground">
                      {new Date(consultation.consultation_date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    <div className="space-y-2">
                      {consultation.estimated_cost && (
                        <div className="text-lg font-semibold text-pink-600">
                          ¥{consultation.estimated_cost.toLocaleString()}
                        </div>
                      )}

                      {consultation.estimated_duration && (
                        <div className="text-xs text-muted-foreground">
                          预计 {consultation.estimated_duration}
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <Link href={`/dashboard/patients/${consultation.patient_id}?tab=cosmetic&context=cosmetic`}>
                          <Button variant="ghost" size="sm" className="justify-end text-pink-600 hover:text-pink-700">
                            查看病人
                          </Button>
                        </Link>
                        <Link href={`/dashboard/cosmetic/consultations/${consultation.id}`}>
                          <Button variant="outline" size="sm" className="mt-0">
                            查看详情
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Before Photos Preview */}
                {consultation.before_photos.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">初诊照片：</p>
                    <div className="flex gap-2">
                      {consultation.before_photos.slice(0, 3).map((photo, idx) => (
                        <div
                          key={idx}
                          className="w-20 h-20 rounded-lg overflow-hidden border"
                        >
                          <img
                            src={photo}
                            alt={`Before photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {consultation.before_photos.length > 3 && (
                        <div className="w-20 h-20 rounded-lg border flex items-center justify-center bg-muted">
                          <span className="text-sm text-muted-foreground">
                            +{consultation.before_photos.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
