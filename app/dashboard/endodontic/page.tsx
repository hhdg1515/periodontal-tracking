'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Syringe, Calendar, Clock, Sparkles, Activity } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Syringe className="h-8 w-8 text-orange-500" />
            根管治疗管理
          </h1>
          <p className="text-muted-foreground mt-1">
            统筹牙髓诊断、治疗进度与复诊安排
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Sparkles className="mr-2 h-4 w-4" />
          新建根管病例
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总病例</CardTitle>
            <Syringe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_cases}</div>
            <p className="text-xs text-muted-foreground">过去 30 天新增 2 例</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃治疗</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_cases}</div>
            <p className="text-xs text-muted-foreground">平均完成度 55%</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">复诊/随访</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.follow_up_cases}</div>
            <p className="text-xs text-muted-foreground">含诊断监测 + 复查</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.success_rate}%</div>
            <p className="text-xs text-muted-foreground">3 个月复查窗口</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming + AI */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
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
                    <p className="font-semibold text-orange-600">
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
              <Sparkles className="h-5 w-5 text-orange-500" />
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
                  <div key={endoCase.id} className="rounded-2xl bg-orange-50/80 p-3 shadow-sm">
                    <p className="text-sm font-semibold text-orange-900">
                      {endoCase.patient_name} · {endoCase.tooth}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-orange-800">
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
                      className="h-2 rounded-full bg-orange-500 transition-all"
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
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                      查看病人
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    更新治疗
                  </Button>
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
