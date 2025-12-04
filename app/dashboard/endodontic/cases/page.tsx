'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DEMO_ENDODONTIC_CASES } from '@/lib/demo/endodontic-mock-data';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PULP_STATUS_LABELS,
  PERIAPICAL_LABELS,
} from '@/lib/types/endodontic';
import { Calendar, Activity, ArrowRight, Syringe } from 'lucide-react';

export default function EndodonticCasesPage() {
  const sortedCases = [...DEMO_ENDODONTIC_CASES].sort((a, b) => b.progress_percentage - a.progress_percentage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Syringe className="h-8 w-8 text-blue-600" />
            根管病例列表
          </h1>
          <p className="text-muted-foreground mt-1">
            快速浏览根管治疗进度，进入病例补充随访与治疗记录
          </p>
        </div>
        <Link href="/dashboard/endodontic">
          <Button variant="ghost" size="sm">
            返回概览
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            全部病例
          </CardTitle>
          <CardDescription>按进度排序，可直接进入详情更新治疗</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sortedCases.map((endoCase) => (
              <div key={endoCase.id} className="rounded-2xl border p-5 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">
                      {endoCase.patient_name} · {endoCase.tooth}
                    </p>
                    <p className="text-sm text-muted-foreground">{endoCase.diagnosis}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      <span className="px-2 py-1 rounded-full bg-gray-50 border">牙髓 {PULP_STATUS_LABELS[endoCase.pulp_status]}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-50 border">根尖 {PERIAPICAL_LABELS[endoCase.periapical_status]}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-50 border">根管数 {endoCase.canals}</span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`bg-${STATUS_COLORS[endoCase.status]}-100 text-${STATUS_COLORS[endoCase.status]}-700`}
                  >
                    {STATUS_LABELS[endoCase.status]}
                  </Badge>
                </div>

                <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>上次：{endoCase.last_visit ? new Date(endoCase.last_visit).toLocaleDateString('zh-CN') : '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>下次：{endoCase.next_visit ? new Date(endoCase.next_visit).toLocaleDateString('zh-CN') : '待约'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span>进度 {endoCase.progress_percentage}%</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${endoCase.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{endoCase.progress_percentage}%</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/dashboard/endodontic/cases/${endoCase.id}`}>
                    <Button size="sm">
                      查看详情
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/patients/${endoCase.patient_id}?tab=endodontic&context=endodontic`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      病人档案
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
