'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Syringe, Calendar, Clock, Sparkles, Activity, ArrowRight } from 'lucide-react';
import {
  DEMO_ENDODONTIC_CASES,
  DEMO_ENDODONTIC_STATS,
  getUpcomingEndodonticVisits,
} from '@/lib/demo/endodontic-mock-data';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PULP_STATUS_LABELS,
} from '@/lib/types/endodontic';

export default function EndodonticPage() {
  const stats = DEMO_ENDODONTIC_STATS;
  const upcomingVisits = getUpcomingEndodonticVisits();
  const activeCases = DEMO_ENDODONTIC_CASES.filter(c =>
    c.status === 'in_progress' || c.status === 'diagnosis'
  );
  const diagnosisCases = DEMO_ENDODONTIC_CASES.filter(c => c.status === 'diagnosis').length;
  const scheduledVisits = upcomingVisits.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Syringe className="h-8 w-8 text-blue-600" />
          根管治疗管理
        </h1>
        <p className="text-muted-foreground mt-1">
          统筹牙髓诊断、治疗进度与复诊安排
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">初诊数</CardTitle>
            <Syringe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultation_count}</div>
            <p className="text-xs text-muted-foreground">过去30天新增 {stats.monthly_new_consultations} 个</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">复诊数</CardTitle>
            <Calendar className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.followup_count}</div>
            <p className="text-xs text-muted-foreground">本月约下来的复诊 {stats.monthly_scheduled_followups} 次</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed_count}</div>
            <p className="text-xs text-muted-foreground">本月完成 {stats.monthly_completed} 个</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stats.service_specific_metric?.label}</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.service_specific_metric?.value}</div>
            <p className="text-xs text-muted-foreground">{stats.service_specific_metric?.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/endodontic/cases">
          <div className="rounded-2xl bg-white p-6 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Syringe className="h-7 w-7" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {DEMO_ENDODONTIC_CASES.length} 例
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">病例列表</h3>
              <p className="text-sm text-gray-600">查看所有根管治疗进度</p>
              <p className="text-xs text-blue-700 font-medium">
                {activeCases.length} 例治疗/诊断中
              </p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/endodontic/cases">
          <div className="rounded-2xl bg-white p-6 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7" />
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                {scheduledVisits} 个预约
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">随访与复诊</h3>
              <p className="text-sm text-gray-600">即将到来的根管治疗行程</p>
              <p className="text-xs text-indigo-700 font-medium">
                {diagnosisCases} 例待决策病例
              </p>
            </div>
          </div>
        </Link>

        <Link
          href={
            (activeCases[0]?.id || DEMO_ENDODONTIC_CASES[0]?.id)
              ? `/dashboard/endodontic/cases/${activeCases[0]?.id || DEMO_ENDODONTIC_CASES[0]?.id}`
              : "/dashboard/endodontic/cases"
          }
        >
          <div className="rounded-2xl bg-white p-6 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7" />
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">更新治疗记录</h3>
              <p className="text-sm text-gray-600">快速进入病例，补充就诊与用药</p>
              <p className="text-xs text-sky-700 font-medium">
                支持新增随访、修改下一次预约
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Upcoming + AI */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              即将到来的就诊
            </CardTitle>
            <CardDescription>追踪根管治疗预约与复诊</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingVisits.map(visit => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between rounded-2xl bg-white/80 p-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-sm">{visit.procedure}</p>
                    <p className="text-xs text-muted-foreground">{visit.notes}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-blue-600">
                      {new Date(visit.visit_date).toLocaleDateString('zh-CN')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(visit.visit_date).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingVisits.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暂无安排，所有病例处于随访阶段
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI 影像观察
            </CardTitle>
            <CardDescription>
              根尖愈合趋势与疑似额外根管提醒
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_ENDODONTIC_CASES.filter(c => c.ai_flags && c.ai_flags.length > 0).map(
                endoCase => (
                  <div key={endoCase.id} className="rounded-2xl bg-blue-50/80 p-3 shadow-sm">
                    <p className="text-sm font-semibold text-blue-900">
                      {endoCase.patient_name} · {endoCase.tooth}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-blue-800">
                      {endoCase.ai_flags!.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cases */}
      <Card>
        <CardHeader>
          <CardTitle>当前治疗病例</CardTitle>
          <CardDescription>根管治疗阶段与复诊安排</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCases.map(endoCase => (
              <div key={endoCase.id} className="rounded-2xl p-5 space-y-3 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {endoCase.patient_name} · {endoCase.tooth}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {endoCase.diagnosis}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`bg-${STATUS_COLORS[endoCase.status]}-100 text-${STATUS_COLORS[endoCase.status]}-700`}
                  >
                    {STATUS_LABELS[endoCase.status]}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p>牙髓状态：{PULP_STATUS_LABELS[endoCase.pulp_status]}</p>
                  <p>根管数：{endoCase.canals}</p>
                  <p>
                    上次就诊：{" "}
                    {endoCase.last_visit
                      ? new Date(endoCase.last_visit).toLocaleDateString('zh-CN')
                      : "—"}
                  </p>
                  <p>
                    下一次：{" "}
                    {endoCase.next_visit
                      ? new Date(endoCase.next_visit).toLocaleDateString('zh-CN')
                      : "待约"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${endoCase.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {endoCase.progress_percentage}%
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/patients/${endoCase.patient_id}?tab=endodontic&context=endodontic`}
                  >
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      查看病人
                    </Button>
                  </Link>
                  <Link href={`/dashboard/endodontic/cases/${endoCase.id}`}>
                    <Button variant="outline" size="sm">
                      更新治疗
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {activeCases.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                当前没有进行中的根管治疗病例。
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
