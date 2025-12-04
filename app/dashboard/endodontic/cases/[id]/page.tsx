'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NewAppointmentDialog } from '@/components/appointments/new-appointment-dialog';
import {
  getDemoEndodonticCaseById,
} from '@/lib/demo/endodontic-mock-data';
import {
  EndodonticVisit,
  STATUS_LABELS,
  STATUS_COLORS,
  PULP_STATUS_LABELS,
  PERIAPICAL_LABELS,
  EndodonticCaseStatus,
  PulpVitality,
  PeriapicalStatus,
} from '@/lib/types/endodontic';
import { Calendar, Activity, ArrowLeft, ArrowRight, Syringe, Plus, Sparkles } from 'lucide-react';

interface PageProps {
  params: { id: string };
}

export default function EndodonticCaseDetailPage({ params }: PageProps) {
  const baseCase = getDemoEndodonticCaseById(params.id);

  if (!baseCase) {
    return notFound();
  }

  const [caseData, setCaseData] = useState(baseCase);
  const [visits, setVisits] = useState<EndodonticVisit[]>(baseCase.visits);
  const [nextVisit, setNextVisit] = useState(baseCase.next_visit || '');
  const [newFlag, setNewFlag] = useState('');
  const [basics, setBasics] = useState({
    pulp_status: caseData.pulp_status as PulpVitality,
    periapical_status: caseData.periapical_status as PeriapicalStatus,
    canals: caseData.canals.toString(),
  });
  const [statusChoice, setStatusChoice] = useState<EndodonticCaseStatus>(caseData.status);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [newVisit, setNewVisit] = useState({
    visit_date: '',
    procedure: '',
    notes: '',
    status: 'scheduled' as EndodonticVisit['status'],
  });

  const upcomingVisits = useMemo(
    () => visits.filter(v => v.status === 'scheduled').sort((a, b) =>
      new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime()
    ),
    [visits],
  );

  const completedVisits = useMemo(
    () => visits.filter(v => v.status === 'completed').sort((a, b) =>
      new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
    ),
    [visits],
  );

  const handleAddVisit = () => {
    if (!newVisit.procedure.trim()) return;
    const visitDate = newVisit.visit_date || new Date().toISOString();
    const created: EndodonticVisit = {
      id: `local-${Date.now()}`,
      case_id: caseData.id,
      visit_date: visitDate,
      procedure: newVisit.procedure.trim(),
      notes: newVisit.notes.trim() || '—',
      status: newVisit.status,
    };

    const updatedVisits = [...visits, created];
    setVisits(updatedVisits);
    setCaseData(prev => ({
      ...prev,
      visits: updatedVisits,
      last_visit: created.status === 'completed' ? visitDate : prev.last_visit,
      next_visit: created.status === 'scheduled' ? visitDate : prev.next_visit,
    }));
    if (created.status === 'scheduled') {
      setNextVisit(visitDate);
    }
    setNewVisit({
      visit_date: '',
      procedure: '',
      notes: '',
      status: 'scheduled',
    });
  };

  const handleSaveNextVisit = () => {
    setCaseData(prev => ({ ...prev, next_visit: nextVisit }));
  };

  const handleSaveBasics = () => {
    const canalsNumber = Number(basics.canals) || caseData.canals;
    setCaseData(prev => ({
      ...prev,
      pulp_status: basics.pulp_status,
      periapical_status: basics.periapical_status,
      canals: canalsNumber,
    }));
  };

  const handleAddFlag = () => {
    if (!newFlag.trim()) return;
    const updatedFlags = [...(caseData.ai_flags || []), newFlag.trim()];
    setCaseData(prev => ({ ...prev, ai_flags: updatedFlags }));
    setNewFlag('');
  };

  const handleStatusChange = (value: EndodonticCaseStatus) => {
    setStatusChoice(value);
    setCaseData(prev => ({ ...prev, status: value }));
  };

  const completedCount = completedVisits.length;
  const totalSteps = completedVisits.length + upcomingVisits.length || 0;
  const progressPercent = totalSteps === 0
    ? caseData.progress_percentage
    : Math.round((completedCount / totalSteps) * 100);

  const CASE_STATUS_LABELS: Record<EndodonticCaseStatus, string> = {
    diagnosis: '诊断中',
    in_progress: '疗程中',
    follow_up: '随访中',
    completed: '已完成',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/dashboard/endodontic/cases" className="inline-flex items-center hover:text-blue-600">
              <ArrowLeft className="h-4 w-4" />
              返回病例列表
            </Link>
          </p>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Syringe className="h-8 w-8 text-blue-600" />
            {caseData.patient_name} · {caseData.tooth}
          </h1>
          <p className="text-muted-foreground">{caseData.diagnosis}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`bg-${STATUS_COLORS[caseData.status]}-100 text-${STATUS_COLORS[caseData.status]}-700`}
          >
            {CASE_STATUS_LABELS[caseData.status]}
          </Badge>
          <select
            className="text-sm border rounded-md px-2 py-1"
            value={statusChoice}
            onChange={(e) => handleStatusChange(e.target.value as EndodonticCaseStatus)}
          >
            <option value="diagnosis">诊断中</option>
            <option value="follow_up">随访/复查</option>
            <option value="completed">已完成</option>
          </select>
          <Button size="sm" onClick={() => setIsAppointmentOpen(true)}>
            为该患者预约
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
            <CardDescription>牙髓与根尖状况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>牙髓状态</span>
              <span className="font-medium text-gray-900">{PULP_STATUS_LABELS[caseData.pulp_status]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>根尖状况</span>
              <span className="font-medium text-gray-900">{PERIAPICAL_LABELS[caseData.periapical_status]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>根管数</span>
              <span className="font-medium text-gray-900">{caseData.canals}</span>
            </div>
            <div className="pt-3 space-y-2 text-gray-900">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">牙髓</span>
                <select
                  className="flex-1 border rounded-md px-2 py-1 text-sm"
                  value={basics.pulp_status}
                  onChange={(e) => setBasics(v => ({ ...v, pulp_status: e.target.value as PulpVitality }))}
                >
                  <option value="vital">活髓</option>
                  <option value="non_vital">失活</option>
                  <option value="irreversible_pulpitis">不可逆性牙髓炎</option>
                  <option value="previously_treated">已根治牙</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">根尖</span>
                <select
                  className="flex-1 border rounded-md px-2 py-1 text-sm"
                  value={basics.periapical_status}
                  onChange={(e) => setBasics(v => ({ ...v, periapical_status: e.target.value as PeriapicalStatus }))}
                >
                  <option value="normal">根尖正常</option>
                  <option value="mild_lesion">轻度根尖病变</option>
                  <option value="large_lesion">明显根尖透射区</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-20">根管数</span>
                <Input
                  type="number"
                  min={1}
                  value={basics.canals}
                  onChange={(e) => setBasics(v => ({ ...v, canals: e.target.value }))}
                />
              </div>
              <Button size="sm" className="w-full" onClick={handleSaveBasics}>
                保存基础信息
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">预约与进度</CardTitle>
            <CardDescription>随访安排与完成度</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                上次就诊
              </span>
              <span className="font-medium text-gray-900">
                {caseData.last_visit ? new Date(caseData.last_visit).toLocaleDateString('zh-CN') : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                下一次
              </span>
              <span className="font-medium text-gray-900">
                {caseData.next_visit ? new Date(caseData.next_visit).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', month: '2-digit', day: '2-digit' }) : '待约'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-medium">{progressPercent}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              进度 = 已完成 {completedCount} 步 / 总步骤 {totalSteps || 1}（基于完成与已预约的记录）
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI 标记</CardTitle>
            <CardDescription>可疑根管与愈合趋势</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseData.ai_flags && caseData.ai_flags.length > 0 ? (
              <ul className="space-y-2 text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded-lg p-3">
                {caseData.ai_flags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">暂无 AI 提示</p>
            )}
            <div className="space-y-2">
              <Label className="text-xs">新增 AI 提示（本地）</Label>
              <Input
                placeholder="例如：AI 建议检查 MB2 根管"
                value={newFlag}
                onChange={(e) => setNewFlag(e.target.value)}
              />
              <Button size="sm" className="w-full" onClick={handleAddFlag}>
                添加标记
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              就诊记录
            </CardTitle>
            <CardDescription>已完成与已预约的治疗步骤</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedVisits.map((visit) => (
              <div key={visit.id} className="rounded-xl border p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{visit.procedure}</p>
                    <p className="text-sm text-muted-foreground">{visit.notes}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">已完成</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(visit.visit_date).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {upcomingVisits.length > 0 && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-800">已预约</p>
                {upcomingVisits.map(visit => (
                  <div key={visit.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{visit.procedure}</p>
                      <p className="text-xs text-muted-foreground">{visit.notes}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">已预约</Badge>
                      <span className="text-xs text-blue-700">
                        {new Date(visit.visit_date).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">新增/更新</CardTitle>
            <CardDescription>补充随访或调整预约时间</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nextVisit">下一次预约</Label>
              <Input
                id="nextVisit"
                type="datetime-local"
                value={nextVisit ? nextVisit.slice(0, 16) : ''}
                onChange={(e) => setNextVisit(e.target.value)}
              />
              <Button onClick={handleSaveNextVisit} size="sm" className="w-full">
                更新预约
              </Button>
            </div>

            <div className="space-y-2">
              <Label>新增就诊/治疗记录</Label>
              <Input
                placeholder="步骤名称，如 根管预备 + 冲洗"
                value={newVisit.procedure}
                onChange={(e) => setNewVisit(v => ({ ...v, procedure: e.target.value }))}
              />
              <Input
                type="datetime-local"
                value={newVisit.visit_date}
                onChange={(e) => setNewVisit(v => ({ ...v, visit_date: e.target.value }))}
              />
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={3}
                placeholder="备注或用药"
                value={newVisit.notes}
                onChange={(e) => setNewVisit(v => ({ ...v, notes: e.target.value }))}
              />
              <div className="flex items-center gap-2 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="visitStatus"
                    value="scheduled"
                    checked={newVisit.status === 'scheduled'}
                    onChange={() => setNewVisit(v => ({ ...v, status: 'scheduled' }))}
                  />
                  预约
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="visitStatus"
                    value="completed"
                    checked={newVisit.status === 'completed'}
                    onChange={() => setNewVisit(v => ({ ...v, status: 'completed' }))}
                  />
                  已完成
                </label>
              </div>
              <Button className="w-full" onClick={handleAddVisit}>
                <Plus className="h-4 w-4 mr-2" />
                保存到病例（本地）
              </Button>
              <p className="text-xs text-muted-foreground">
                当前为演示数据，修改只在本页面会话内生效。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="text-sm text-muted-foreground">
            病人档案：更完整的就诊历史在患者页中查看。
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/patients/${caseData.patient_id}?tab=endodontic&context=endodontic`}>
              <Button variant="ghost" size="sm">
                病人档案
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/endodontic/cases">
              <Button variant="outline" size="sm">
                返回列表
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <NewAppointmentDialog
        open={isAppointmentOpen}
        onOpenChange={setIsAppointmentOpen}
        defaultPatientId={caseData.patient_id}
        defaultService="endodontic"
        defaultTooth={caseData.tooth}
      />
    </div>
  );
}
