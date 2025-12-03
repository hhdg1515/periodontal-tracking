'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  DEMO_CONSULTATIONS,
  DEMO_TREATMENT_PLANS,
  DEMO_COSMETIC_STATS,
} from '@/lib/demo/cosmetic-mock-data';
import { TREATMENT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/types/cosmetic';

export default function CosmeticDashboardPage() {
  const stats = DEMO_COSMETIC_STATS;
  const recentConsultations = DEMO_CONSULTATIONS.slice(0, 3);
  const activeTreatments = DEMO_TREATMENT_PLANS.filter(p => p.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-pink-500" />
            牙齿美容
          </h1>
          <p className="text-muted-foreground mt-1">
            管理美容咨询、治疗方案和 Before/After 效果展示
          </p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Calendar className="mr-2 h-4 w-4" />
          新建咨询
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总咨询数</CardTitle>
            <Calendar className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_consultations}</div>
            <p className="text-xs text-muted-foreground">本月新增 3 个</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中治疗</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_treatments}</div>
            <p className="text-xs text-muted-foreground">平均进度 55%</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成治疗</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed_treatments}</div>
            <p className="text-xs text-muted-foreground">本月完成 1 个</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>最近咨询</CardTitle>
                <CardDescription>最新的美容咨询记录</CardDescription>
              </div>
              <Link href="/dashboard/cosmetic/consultations">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConsultations.map(consultation => (
                <div
                  key={consultation.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/80 shadow-sm hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      <Link
                        href={`/dashboard/patients/${consultation.patient_id}?tab=cosmetic&context=cosmetic`}
                        className="hover:text-pink-600 transition-colors"
                      >
                        {consultation.patient_name}
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {consultation.desired_outcome}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {consultation.recommended_treatments.map(treatment => (
                        <Badge key={treatment} variant="secondary" className="text-xs">
                          {TREATMENT_TYPE_LABELS[treatment]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant="secondary"
                      className={`bg-${STATUS_COLORS[consultation.status]}-100 text-${STATUS_COLORS[consultation.status]}-700`}
                    >
                      {STATUS_LABELS[consultation.status]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(consultation.consultation_date).toLocaleDateString('zh-CN')}
                    </p>
                    <Link
                      href={`/dashboard/patients/${consultation.patient_id}?tab=cosmetic&context=cosmetic`}
                      className="text-xs text-pink-600 hover:underline inline-flex justify-end"
                    >
                      查看病人
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Treatments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>进行中的治疗</CardTitle>
                <CardDescription>当前活跃的美容治疗项目</CardDescription>
              </div>
              <Link href="/dashboard/cosmetic/treatments">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTreatments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  暂无进行中的治疗
                </p>
              ) : (
                activeTreatments.map(treatment => (
                  <div
                    key={treatment.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/80 shadow-sm hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="font-medium">
                        <Link
                          href={`/dashboard/patients/${treatment.patient_id}?tab=cosmetic&context=cosmetic`}
                          className="hover:text-pink-600 transition-colors"
                        >
                          {treatment.patient_name}
                        </Link>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {treatment.treatment_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${treatment.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {treatment.progress_percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {STATUS_LABELS[treatment.status]}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {treatment.total_visits} 次就诊
                      </p>
                      <Link
                        href={`/dashboard/patients/${treatment.patient_id}?tab=cosmetic&context=cosmetic`}
                        className="text-xs text-pink-600 hover:underline inline-flex justify-end mt-1"
                      >
                        查看病人
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用功能快捷入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/dashboard/cosmetic/consultations">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Calendar className="h-6 w-6 text-pink-500" />
                <span>咨询列表</span>
              </Button>
            </Link>
            <Link href="/dashboard/cosmetic/treatments">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Sparkles className="h-6 w-6 text-blue-500" />
                <span>治疗方案</span>
              </Button>
            </Link>
            <Link href="/dashboard/cosmetic/before-after">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span>效果对比</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex-col gap-2" disabled>
              <Sparkles className="h-6 w-6 text-purple-500" />
              <span>案例档案</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
