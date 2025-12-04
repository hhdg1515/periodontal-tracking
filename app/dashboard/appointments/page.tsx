'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Appointment, AppointmentStatus, AppointmentService } from '@/lib/types/appointment';
import { Calendar, Clock } from 'lucide-react';
import { NewAppointmentDialog } from '@/components/appointments/new-appointment-dialog';
import { persistAppointments, useAppointments } from '@/lib/hooks/use-appointments';

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: '已预约',
  confirmed: '已预约',
  completed: '已完成',
  cancelled: '已预约',
};

const statusStyles: Record<AppointmentStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-blue-50 text-blue-600',
};

const serviceLabels: Record<AppointmentService, string> = {
  periodontal: '牙周病',
  endodontic: '根管',
  implant: '种植',
  cosmetic: '美容',
};

export default function AppointmentsPage() {
  const { appointments, mutate } = useAppointments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    const next = appointments.map(appt => appt.id === id ? { ...appt, status } : appt);
    persistAppointments(next);
    mutate();
  };

  const handleCreated = (appt: Appointment) => {
    const next = [appt, ...appointments.filter(p => p.id !== appt.id)];
    persistAppointments(next);
    mutate();
  };

  const handleNavigate = (appt: Appointment) => {
    const tabMap: Record<AppointmentService, string> = {
      periodontal: 'periodontal',
      endodontic: 'endodontic',
      implant: 'implant',
      cosmetic: 'cosmetic',
    };
    const tab = tabMap[appt.service];
    router.push(`/dashboard/patients/${appt.patient_id}?tab=${tab}&context=${tab}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">预约列表</h1>
          <p className="text-muted-foreground mt-1">集中查看与更新所有服务的预约</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">返回总览</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>全部预约</CardTitle>
          <CardDescription>状态可在此快速更新</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {appointments.map(appt => (
            <div
              key={appt.id}
              className="rounded-xl border p-4 bg-white flex flex-wrap items-center gap-3 justify-between hover:border-blue-200 cursor-pointer"
              onClick={() => handleNavigate(appt)}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{appt.patient_name}</p>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">{serviceLabels[appt.service]}</Badge>
                  {appt.tooth && <Badge variant="outline" className="text-xs">{appt.tooth}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{appt.notes || '无备注'}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {new Date(appt.datetime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {appt.doctor && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {appt.doctor}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={appt.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(appt.id, e.target.value as AppointmentStatus)}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value="scheduled">已预约</option>
                  <option value="completed">已完成</option>
                </select>
                <Badge className={statusStyles[appt.status]}>
                  {statusLabels[appt.status]}
                </Badge>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">暂时还没有预约记录。</p>
          )}
        </CardContent>
      </Card>

      <NewAppointmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}
