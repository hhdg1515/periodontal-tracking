'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, TrendingUp, CheckCircle, Clock, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  DEMO_IMPLANT_CASES,
  DEMO_IMPLANT_STATS,
  getActiveCases,
  getCompletedCases,
} from '@/lib/demo/implant-mock-data';
import {
  STAGE_LABELS,
  TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  getStageColor,
} from '@/lib/types/implant';

export default function ImplantDashboardPage() {
  const stats = DEMO_IMPLANT_STATS;
  const activeCases = getActiveCases();
  const recentCases = DEMO_IMPLANT_CASES.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8 text-purple-500" />
            种植牙管理
          </h1>
          <p className="text-muted-foreground mt-1">
            管理种植案例、追踪手术进度和愈合情况
          </p>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Calendar className="mr-2 h-4 w-4" />
          新建案例
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总案例数</CardTitle>
            <Wrench className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_cases}</div>
            <p className="text-xs text-muted-foreground">本月新增 1 个</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_cases}</div>
            <p className="text-xs text-muted-foreground">平均进度 53%</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed_cases}</div>
            <p className="text-xs text-muted-foreground">成功率 {stats.success_rate}%</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总种植体</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_implants}</div>
            <p className="text-xs text-muted-foreground">单颗/多颗/全口</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Cases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>进行中的案例</CardTitle>
                <CardDescription>当前活跃的种植项目</CardDescription>
              </div>
              <Link href="/dashboard/implant/cases">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCases.map(implantCase => {
                const patientHubUrl = `/dashboard/patients/${implantCase.patient_id}?tab=implant&context=implant`;
                return (
                  <div
                    key={implantCase.id}
                    className="flex flex-col gap-4 p-3 rounded-xl bg-white/80 shadow-sm hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">
                          <Link
                            href={patientHubUrl}
                            className="hover:text-purple-600 transition-colors"
                          >
                            {implantCase.patient_name}
                          </Link>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {TYPE_LABELS[implantCase.case_type]} - {implantCase.implant_count} 颗
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`bg-${getStageColor(implantCase.current_stage)}-100 text-${getStageColor(implantCase.current_stage)}-700`}
                          >
                            {STAGE_LABELS[implantCase.current_stage]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            进度 {implantCase.progress_percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {implantCase.implant_count} 颗种植体
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {STAGE_LABELS[implantCase.current_stage]}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/implant/cases/${implantCase.id}`}>
                        <Button size="sm" variant="outline">
                          案例详情
                        </Button>
                      </Link>
                      <Link href={patientHubUrl}>
                        <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                          查看病人
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Cases Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>最近案例</CardTitle>
                <CardDescription>最新的种植项目</CardDescription>
              </div>
              <Link href="/dashboard/implant/cases">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.map(implantCase => (
                <div
                  key={implantCase.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/80 shadow-sm hover:bg-accent transition-colors"
                >
                  <div className={`mt-1 h-2 w-2 rounded-full bg-${STATUS_COLORS[implantCase.status]}-500`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/dashboard/patients/${implantCase.patient_id}?tab=implant&context=implant`}
                        className="font-medium hover:text-purple-600 transition-colors"
                      >
                        {implantCase.patient_name}
                      </Link>
                      <Badge variant="outline" className="text-xs">
                        {TYPE_LABELS[implantCase.case_type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      牙位: {implantCase.tooth_positions.join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {implantCase.consultation_date &&
                        `初诊: ${new Date(implantCase.consultation_date).toLocaleDateString('zh-CN')}`
                      }
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`bg-${STATUS_COLORS[implantCase.status]}-100 text-${STATUS_COLORS[implantCase.status]}-700`}
                  >
                    {STATUS_LABELS[implantCase.status]}
                  </Badge>
                </div>
              ))}
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
            <Link href="/dashboard/implant/cases">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Wrench className="h-6 w-6 text-purple-500" />
                <span>案例列表</span>
              </Button>
            </Link>
            <Link href="/dashboard/implant/planning">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                <span>手术规划</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex-col gap-2" disabled>
              <Clock className="h-6 w-6 text-orange-500" />
              <span>愈合追踪</span>
            </Button>
            <Button variant="outline" className="w-full h-20 flex-col gap-2" disabled>
              <FileText className="h-6 w-6 text-green-500" />
              <span>病历报告</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">成功率 {stats.success_rate}%</h3>
              <p className="text-muted-foreground">
                基于 {stats.total_implants} 颗种植体的临床数据
              </p>
            </div>
            <div className="text-right">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
