import { useEffect, useMemo, useState } from "react";
import { DEMO_APPOINTMENTS } from "@/lib/demo/appointments";
import { Appointment } from "@/lib/types/appointment";

const STORAGE_KEY = "mock_appointments";

const getPersistedAppointments = (): Appointment[] => {
  if (typeof window === "undefined") return DEMO_APPOINTMENTS;
  try {
    const storedJson = localStorage.getItem(STORAGE_KEY);
    const stored = storedJson ? JSON.parse(storedJson) : [];
    const merged = new Map<string, Appointment>();
    [...DEMO_APPOINTMENTS, ...stored].forEach((appt: Appointment) => {
      merged.set(appt.id, appt);
    });
    return Array.from(merged.values());
  } catch {
    return DEMO_APPOINTMENTS;
  }
};

export function useAppointments(patientId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS);

  useEffect(() => {
    setAppointments(getPersistedAppointments());
  }, []);

  useEffect(() => {
    const handler = () => setAppointments(getPersistedAppointments());
    window.addEventListener("storage", handler);
    window.addEventListener("appointments-updated", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("appointments-updated", handler as EventListener);
    };
  }, []);

  const mutate = () => {
    setAppointments(getPersistedAppointments());
  };

  const filtered = useMemo(() => {
    if (!patientId) return appointments;
    return appointments.filter((appt) => appt.patient_id === patientId);
  }, [appointments, patientId]);

  return { appointments: filtered, mutate };
}

export function persistAppointments(appts: Appointment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appts));
  window.dispatchEvent(new Event("appointments-updated"));
}

/**
 * 获取待处理的预约数量（用于铃铛显示）
 * 待处理 = scheduled（待出方案）+ pending_confirm（待确认）
 */
export function usePendingCount() {
  const { appointments } = useAppointments();

  const pendingCount = useMemo(() => {
    return appointments.filter(
      (appt) => appt.status === "scheduled" || appt.status === "pending_confirm"
    ).length;
  }, [appointments]);

  const todayConfirmedCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter(
      (appt) => appt.status === "confirmed" && appt.datetime.startsWith(today)
    ).length;
  }, [appointments]);

  return { pendingCount, todayConfirmedCount, total: pendingCount + todayConfirmedCount };
}
