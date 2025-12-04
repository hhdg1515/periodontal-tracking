"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Users,
  BarChart3,
  Settings,
  Plus,
  Sparkles,
  Wrench,
  Syringe,
  Search,
  Bell,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import { Input } from "@/components/ui/input";
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog";
import { usePendingCount } from "@/lib/hooks/use-appointments";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const { pendingCount } = usePendingCount();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const getNavLinkClass = (href: string) => {
    const baseClass = "flex items-center space-x-3 px-3 py-2 rounded-lg";
    const activeClass = "bg-blue-50 text-blue-600";
    const inactiveClass = "hover:bg-gray-100 text-gray-700";
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="px-6 py-4 flex flex-wrap items-center gap-4">
          <Link href="/dashboard" className="flex items-center space-x-2 min-w-[180px]">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">{t("common.appName")}</span>
          </Link>
          <div className="flex-1 min-w-[240px]">
            <div className="relative max-w-xl mx-auto">
              <Search className="h-4 w-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                placeholder={t("common.searchPlaceholder") || "Search patients, appointments..."}
                className="h-11 rounded-full bg-gray-100 border-none pl-11 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsNewAppointmentOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建预约
            </Button>
            <button
              className="relative h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900"
              title={`${pendingCount} 个待处理案例`}
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-medium text-white">
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
            </button>
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">DC</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-57px)] shadow-sm">
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className={getNavLinkClass("/dashboard")}
            >
              <BarChart3 className="h-5 w-5" />
              <span>{t("layout.nav.dashboard")}</span>
            </Link>
            <Link
              href="/dashboard/patients"
              className={getNavLinkClass("/dashboard/patients")}
            >
              <Users className="h-5 w-5" />
              <span>{t("layout.nav.patients")}</span>
            </Link>

            <Link
              href="/dashboard/appointments"
              className={getNavLinkClass("/dashboard/appointments")}
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>预约</span>
            </Link>

            {/* Services Section */}
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                服务模块
              </p>
            </div>

            <Link
              href="/dashboard/analyses"
              className={getNavLinkClass("/dashboard/analyses")}
            >
              <Activity className="h-5 w-5 text-blue-600" />
              <span>牙周病追踪</span>
            </Link>

            <Link
              href="/dashboard/cosmetic"
              className={getNavLinkClass("/dashboard/cosmetic")}
            >
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span>牙齿美容</span>
            </Link>

            <Link
              href="/dashboard/implant"
              className={getNavLinkClass("/dashboard/implant")}
            >
              <Wrench className="h-5 w-5 text-purple-500" />
              <span>种植牙</span>
            </Link>

            <Link
              href="/dashboard/endodontic"
              className={getNavLinkClass("/dashboard/endodontic")}
            >
              <Syringe className="h-5 w-5 text-blue-600" />
              <span>根管治疗</span>
            </Link>

            {/* Settings Section */}
            <div className="pt-4"></div>
            <Link
              href="/dashboard/settings"
              className={getNavLinkClass("/dashboard/settings")}
            >
              <Settings className="h-5 w-5" />
              <span>{t("layout.nav.settings")}</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      {/* Global New Appointment Dialog */}
      <NewAppointmentDialog
        open={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
      />
    </div>
  );
}
