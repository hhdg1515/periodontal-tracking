'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DEMO_APPOINTMENTS } from '@/lib/demo/appointments';
import { DEMO_CLINIC_ID, usePatients } from '@/lib/hooks/use-patients';
import { persistAppointments } from '@/lib/hooks/use-appointments';
import {
  Appointment,
  AppointmentPriority,
  AppointmentService,
} from '@/lib/types/appointment';
import { Calendar, Clock, User, ClipboardList, Sparkles, AlertTriangle } from 'lucide-react';

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPatientId?: string;
  defaultService?: AppointmentService;
  defaultTooth?: string;
  onCreated?: (appointment: Appointment) => void;
}

const serviceLabels: Record<AppointmentService, string> = {
  periodontal: '牙周病',
  endodontic: '根管',
  implant: '种植',
  cosmetic: '美容',
};

const priorityLabels: Record<AppointmentPriority, string> = {
  routine: '常规',
  urgent: '加急',
};

export function NewAppointmentDialog({
  open,
  onOpenChange,
  defaultPatientId,
  defaultService,
  defaultTooth,
  onCreated,
}: NewAppointmentDialogProps) {
  const { patients, mutate } = usePatients();
  const [patientId, setPatientId] = useState(defaultPatientId || '');
  const [service, setService] = useState<AppointmentService>(defaultService || 'endodontic');
  const [tooth, setTooth] = useState(defaultTooth || '');
  const [priority, setPriority] = useState<AppointmentPriority>('routine');
  const [datetime, setDatetime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    setPatientId(defaultPatientId || '');
    setService(defaultService || 'endodontic');
    if (defaultTooth) setTooth(defaultTooth);
  }, [defaultPatientId, defaultService, defaultTooth, open]);

  const patientName = useMemo(() => {
    const found = patients.find(p => p.id === patientId);
    return found ? `${found.first_name} ${found.last_name}` : '';
  }, [patientId, patients]);

  const handleSubmit = () => {
    if (!patientId || !datetime) {
      setError('请选择患者并填写预约时间');
      return;
    }
    const id = `apt-${Date.now()}`;
    const appointment: Appointment = {
      id,
      patient_id: patientId,
      patient_name: patientName || '未命名患者',
      service,
      tooth,
      priority,
      datetime,
      doctor,
      notes,
      status: 'scheduled',
      created_at: new Date().toISOString(),
    };

    try {
      const storedJson = typeof window !== 'undefined' ? localStorage.getItem('mock_appointments') : null;
      const stored = storedJson ? JSON.parse(storedJson) : [];
      persistAppointments([...stored, appointment]);
      onCreated?.(appointment);
      onOpenChange(false);
      setError(null);
      setDoctor('');
      setNotes('');
      setIsQuickAddOpen(false);
      setNewPatient({ firstName: '', lastName: '', phone: '' });
    } catch (err: any) {
      setError(err?.message || '保存预约失败');
    }
  };

  const handleQuickAddPatient = () => {
    if (!newPatient.firstName.trim() || !newPatient.lastName.trim()) {
      setError('请填写患者姓名');
      return;
    }
    const timestamp = Date.now().toString().slice(-6);
    const newId = `${newPatient.firstName[0] || 'P'}${newPatient.lastName[0] || 'N'}-${timestamp}`.toUpperCase();
    const patientRecord = {
      id: newId,
      patient_id: newId,
      first_name: newPatient.firstName.trim(),
      last_name: newPatient.lastName.trim(),
      date_of_birth: '',
      email: null,
      phone: newPatient.phone || null,
      is_smoker: false,
      has_diabetes: false,
      clinic_id: DEMO_CLINIC_ID,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      const storedJson = typeof window !== 'undefined' ? localStorage.getItem('mock_patients') : null;
      const stored = storedJson ? JSON.parse(storedJson) : [];
      localStorage.setItem('mock_patients', JSON.stringify([...stored, patientRecord]));
      mutate?.();
      setPatientId(newId);
      setIsQuickAddOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err?.message || '创建患者失败');
    }
  };

  const suggestedTime = useMemo(() => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  }, []);

  useEffect(() => {
    if (!datetime && open) {
      setDatetime(suggestedTime);
    }
  }, [open, datetime, suggestedTime]);

  const serviceHint = {
    periodontal: '记录牙位和分区出血/深度要点',
    endodontic: '标注牙位与症状，复诊或治疗步骤',
    implant: '注明牙位/象限，是否需 CBCT/导板',
    cosmetic: '填写项目意向与预算/期望',
  }[service];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>新建预约</DialogTitle>
          <DialogDescription>选择患者、服务与时间，提交后视为“已预约”</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-sm">患者</Label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">选择患者</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-4 w-4" />
              找不到患者？
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(v => !v)}
                className="text-blue-600 hover:underline"
              >
                快速新建
              </button>
            </div>
            {isQuickAddOpen && (
              <div className="rounded-lg border p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="名"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient(v => ({ ...v, firstName: e.target.value }))}
                  />
                  <Input
                    placeholder="姓"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient(v => ({ ...v, lastName: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="电话（可选）"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient(v => ({ ...v, phone: e.target.value }))}
                />
                <Button size="sm" className="w-full" type="button" onClick={handleQuickAddPatient}>
                  保存并选择
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm">服务类型</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['periodontal','endodontic','implant','cosmetic'] as AppointmentService[]).map(s => (
                <button
                  key={s}
                  onClick={() => setService(s)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                    service === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  type="button"
                >
                  <span>{serviceLabels[s]}</span>
                  {service === s && <Badge className="bg-blue-500 text-white">当前</Badge>}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{serviceHint}</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm">牙位/区域</Label>
            <Input
              placeholder="如 #36, #11 或 全口"
              value={tooth}
              onChange={(e) => setTooth(e.target.value)}
            />
            <Label className="text-sm">备注/症状</Label>
            <Input
              placeholder="症状、期望或需要准备的材料"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1"><Calendar className="h-4 w-4" /> 时间</Label>
                <Input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1"><Clock className="h-4 w-4" /> 医生/负责人</Label>
                <Input
                  placeholder="可留空"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> 优先级</Label>
              <div className="flex gap-2">
                {(['routine','urgent'] as AppointmentPriority[]).map(p => (
                  <Button
                    key={p}
                    type="button"
                    variant={priority === p ? 'default' : 'outline'}
                    className={priority === p ? '' : 'text-gray-600'}
                    onClick={() => setPriority(p)}
                  >
                    {priorityLabels[p]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1"><ClipboardList className="h-4 w-4" /> 模板建议</Label>
              <p className="text-xs text-muted-foreground">
                提交后即视为“已预约”，可在预约列表修改为“已确认/到诊/完成”
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-4 w-4 text-blue-500" />
            已有示例预约 {DEMO_APPOINTMENTS.length} 条，新建的会保存在本地浏览器。
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button onClick={handleSubmit}>保存预约</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
