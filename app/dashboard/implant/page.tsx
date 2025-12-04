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
  const planningCases = DEMO_IMPLANT_CASES.filter(
    implantCase => implantCase.current_stage === 'planning' || implantCase.status === 'planned',
  ).length;
  const healingCases = DEMO_IMPLANT_CASES.filter(
    implantCase => implantCase.current_stage === 'healing',
  ).length;
  const completedCases = getCompletedCases().length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wrench className="h-8 w-8 text-purple-500" />
          种植牙管理
        </h1>
        <p className="text-muted-foreground mt-1">
          管理种植案例、追踪手术进度和愈合情况
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">初诊数</CardTitle>
            <Wrench className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultation_count}</div>
            <p className="text-xs text-muted-foreground">过去30天新增 {stats.monthly_new_consultations} 个</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">复诊数</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.followup_count}</div>
            <p className="text-xs text-muted-foreground">本月约下来的复诊 {stats.monthly_scheduled_followups} 次</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed_count}</div>
            <p className="text-xs text-muted-foreground">本月完成 {stats.monthly_completed} 个</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stats.service_specific_metric?.label}</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.service_specific_metric?.value}</div>
            <p className="text-xs text-muted-foreground">{stats.service_specific_metric?.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Simple Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/dashboard/implant/cases">
          <div className="rounded-2xl bg-white p-6 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="h-7 w-7" />
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">案例列表</h3>
              <p className="text-sm text-gray-600">查看所有种植项目</p>
              <p className="text-xs text-purple-600 font-medium">
                {activeCases.length} 个进行中 · {completedCases} 已完成
              </p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/implant/planning">
          <div className="rounded-2xl bg-white p-6 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7" />
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">手术规划</h3>
              <p className="text-sm text-gray-600">CBCT 导板与术前方案</p>
              <p className="text-xs text-blue-600 font-medium">
                {planningCases} 个待规划/审核
              </p>
            </div>
          </div>
        </Link>

        <div className="rounded-2xl bg-white p-6 hover:shadow-lg transition-all group border border-dashed border-gray-200">
          <div className="flex items-start justify-between">
            <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="h-7 w-7" />
            </div>
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
              即将上线
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">愈合追踪</h3>
            <p className="text-sm text-gray-600">术后随访、拆线与复查提醒</p>
            <p className="text-xs text-amber-700 font-medium">
              {healingCases} 个病例处于愈合期
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 hover:shadow-lg transition-all group border border-dashed border-gray-200">
          <div className="flex items-start justify-between">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7" />
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
              即将上线
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">病历报告</h3>
            <p className="text-sm text-gray-600">一键生成随访与患者报告</p>
            <p className="text-xs text-emerald-700 font-medium">
              {completedCases} 份案例可生成报告
            </p>
          </div>
        </div>
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

      {/* Success Rate */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{stats.service_specific_metric?.label} {stats.service_specific_metric?.value}</h3>
              <p className="text-muted-foreground">
                {stats.service_specific_metric?.description}
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
