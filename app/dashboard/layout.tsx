"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Users, FolderOpen, BarChart3, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
      <nav className="bg-white border-b">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PerioTrack AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Demo Clinic</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">DC</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-57px)]">
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className={getNavLinkClass("/dashboard")}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/patients"
              className={getNavLinkClass("/dashboard/patients")}
            >
              <Users className="h-5 w-5" />
              <span>Patients</span>
            </Link>
            <Link
              href="/dashboard/analyses"
              className={getNavLinkClass("/dashboard/analyses")}
            >
              <FolderOpen className="h-5 w-5" />
              <span>Analyses</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={getNavLinkClass("/dashboard/settings")}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
