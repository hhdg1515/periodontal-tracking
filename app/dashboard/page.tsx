"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/lib/i18n/language-context";
import type { SupportedLanguage } from "@/lib/i18n/translations";
import {
  Activity,
  Sparkles,
  Wrench,
  Syringe,
  CalendarDays,
  Users,
  TrendingUp,
  Clock3,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DEMO_PERIODONTAL_STATS,
  DEMO_VISITS,
} from "@/lib/demo/mock-data";
import {
  DEMO_CONSULTATIONS,
  DEMO_COSMETIC_STATS,
} from "@/lib/demo/cosmetic-mock-data";
import {
  DEMO_IMPLANT_CASES,
  DEMO_IMPLANT_STATS,
} from "@/lib/demo/implant-mock-data";
import {
  DEMO_ENDODONTIC_CASES,
  DEMO_ENDODONTIC_STATS,
} from "@/lib/demo/endodontic-mock-data";
import { getTotalAppointments } from "@/lib/types/service-stats";

type ActivityType = "initial" | "followup" | "completed";

interface ActivityItem {
  id: string;
  patientEn: string;
  service: keyof typeof SERVICE_TAG_STYLES;
  descriptionEn: string;
  descriptionZh: string;
  description?: string;
  progress: number;
  timestamp: Date;
  type: ActivityType;
}

interface ScheduleItem {
  id: string;
  patientEn: string;
  service: keyof typeof SERVICE_TAG_STYLES;
  visitType: ActivityType;
  timeLabel: string;
  timestamp: number;
}

const SUMMARY_CARDS = [
  {
    id: "today",
    titleEn: "Today's Appointments",
    titleZh: "今日预约",
    value: "24",
    delta: "+12%",
    trendColor: "text-emerald-500",
    helperEn: "8 initial · 16 follow-up",
    helperZh: "8 初诊 · 16 复诊",
    Icon: CalendarDays,
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    id: "patients",
    titleEn: "Active Patients",
    titleZh: "活跃病人数",
    value: "1,847",
    delta: "+8%",
    trendColor: "text-emerald-500",
    helperEn: "32 new this week",
    helperZh: "本周新增 32 位",
    Icon: Users,
    iconBg: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "month",
    titleEn: "This Month",
    titleZh: "本月门诊",
    value: "342",
    delta: "+15%",
    trendColor: "text-emerald-500",
    helperEn: "Total appointments",
    helperZh: "总预约次数",
    Icon: TrendingUp,
    iconBg: "bg-purple-50 text-purple-600",
  },
  {
    id: "wait",
    titleEn: "Avg. Wait Time",
    titleZh: "平均等候时间",
    value: "12m",
    delta: "-18%",
    trendColor: "text-red-500",
    helperEn: "Target: 15m",
    helperZh: "目标：15 分钟",
    Icon: Clock3,
    iconBg: "bg-sky-50 text-sky-600",
  },
];

const SERVICE_CARDS = [
  {
    id: "periodontal",
    titleEn: "Periodontal Disease",
    titleZh: "牙周病门诊",
    subtitleEn: "Periodontal therapy",
    subtitleZh: "牙周病治疗",
    stats: DEMO_PERIODONTAL_STATS,
    trend: "+18%",
    href: "/dashboard/periodontal",
    Icon: Activity,
    accent: "bg-[#E9F8FF]",
    iconBg: "bg-blue-100 text-blue-600",
    progressColor: "bg-blue-500",
  },
  {
    id: "cosmetic",
    titleEn: "Cosmetic Dentistry",
    titleZh: "美容牙科",
    subtitleEn: "Smile design & whitening",
    subtitleZh: "微笑设计与美白",
    stats: DEMO_COSMETIC_STATS,
    trend: "+24%",
    href: "/dashboard/cosmetic",
    Icon: Sparkles,
    accent: "bg-[#FCEFFE]",
    iconBg: "bg-pink-100 text-pink-600",
    progressColor: "bg-pink-500",
  },
  {
    id: "implant",
    titleEn: "Dental Implants",
    titleZh: "种植牙",
    subtitleEn: "Implant case tracking",
    subtitleZh: "种植牙管理",
    stats: DEMO_IMPLANT_STATS,
    trend: "+12%",
    href: "/dashboard/implant",
    Icon: Wrench,
    accent: "bg-[#F4FAEB]",
    iconBg: "bg-lime-100 text-lime-600",
    progressColor: "bg-lime-500",
  },
  {
    id: "endodontic",
    titleEn: "Endodontics",
    titleZh: "根管治疗",
    subtitleEn: "Root canal follow-up",
    subtitleZh: "根管治疗流程",
    stats: DEMO_ENDODONTIC_STATS,
    trend: "+9%",
    href: "/dashboard/endodontic",
    Icon: Syringe,
    accent: "bg-[#FFF5EC]",
    iconBg: "bg-orange-100 text-orange-600",
    progressColor: "bg-orange-500",
  },
];

const SERVICE_TAG_STYLES = {
  periodontal: "bg-blue-50 text-blue-600",
  cosmetic: "bg-pink-50 text-pink-600",
  implant: "bg-lime-50 text-lime-600",
  endodontic: "bg-amber-50 text-amber-600",
};

const SERVICE_LABELS = {
  periodontal: { en: "Periodontal", zh: "牙周" },
  cosmetic: { en: "Cosmetic", zh: "美容" },
  implant: { en: "Implant", zh: "种植" },
  endodontic: { en: "Endodontic", zh: "根管" },
};

const VISIT_TYPE_LABELS: Record<SupportedLanguage, Record<ActivityType, string>> = {
  en: {
    initial: "Initial",
    followup: "Follow-up",
    completed: "Completed",
  },
  zh: {
    initial: "初诊",
    followup: "复诊",
    completed: "完成",
  },
};

const VISIT_TYPE_STYLES: Record<ActivityType, string> = {
  initial: "bg-pink-50 text-pink-600",
  followup: "bg-sky-50 text-sky-600",
  completed: "bg-emerald-50 text-emerald-600",
};

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "li-wei",
    patientEn: "Li Wei",
    service: "periodontal",
    descriptionEn: "AI X-ray analysis completed",
    descriptionZh: "AI X 光分析已完成",
    progress: 0.75,
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: "followup",
  },
  {
    id: "zhang-min",
    patientEn: "Zhang Min",
    service: "cosmetic",
    descriptionEn: "Veneer consultation · before photos taken",
    descriptionZh: "贴面咨询 · 已拍摄术前照",
    progress: 0.3,
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: "initial",
  },
  {
    id: "wang-fang",
    patientEn: "Wang Fang",
    service: "implant",
    descriptionEn: "Stage 2 surgery scheduled",
    descriptionZh: "第二阶段手术已排程",
    progress: 0.6,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: "followup",
  },
  {
    id: "chen-yu",
    patientEn: "Chen Yu",
    service: "endodontic",
    descriptionEn: "Root canal therapy completed",
    descriptionZh: "根管治疗已完成",
    progress: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "completed",
  },
];

const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: "schedule-1",
    patientEn: "Li Ming",
    service: "periodontal",
    visitType: "initial",
    timeLabel: "09:00",
    timestamp: Date.now() + 30 * 60 * 1000,
  },
  {
    id: "schedule-2",
    patientEn: "Wang Li",
    service: "implant",
    visitType: "followup",
    timeLabel: "10:30",
    timestamp: Date.now() + 90 * 60 * 1000,
  },
  {
    id: "schedule-3",
    patientEn: "Zhang Hua",
    service: "cosmetic",
    visitType: "initial",
    timeLabel: "14:00",
    timestamp: Date.now() + 4 * 60 * 60 * 1000,
  },
  {
    id: "schedule-4",
    patientEn: "Liu Fang",
    service: "endodontic",
    visitType: "followup",
    timeLabel: "15:30",
    timestamp: Date.now() + 5.5 * 60 * 60 * 1000,
  },
];

const PATIENT_HUB_METRICS = [
  {
    id: "visits",
    titleEn: "Total Visits",
    titleZh: "总门诊次数",
    subtitleEn: "Across all services",
    subtitleZh: "包含所有科别",
    delta: "+12% vs last month",
  },
  {
    id: "xrays",
    titleEn: "X-ray Scans",
    titleZh: "X 光影像",
    subtitleEn: "This quarter",
    subtitleZh: "本季度上传",
    delta: "+24% vs last quarter",
  },
  {
    id: "reports",
    titleEn: "AI Reports",
    titleZh: "AI 报告",
    subtitleEn: "Generated",
    subtitleZh: "已产出",
    delta: "98.5% accuracy",
  },
];

const PATIENT_HUB_ICONS = {
  visits: Users,
  xrays: Activity,
  reports: Sparkles,
};

const formatNumber = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 0 });

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

export default function DashboardPage() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [activityTab, setActivityTab] = useState<ActivityType>("followup");

  const summaryCards = useMemo(
    () =>
      SUMMARY_CARDS.map((card) => ({
        ...card,
        title: isZh ? card.titleZh : card.titleEn,
        helper: isZh ? card.helperZh : card.helperEn,
      })),
    [isZh]
  );

  const serviceCards = useMemo(
    () =>
      SERVICE_CARDS.map((card) => ({
        ...card,
        title: isZh ? card.titleZh : card.titleEn,
        subtitle: isZh ? card.subtitleZh : card.subtitleEn,
      })),
    [isZh]
  );

  const patientHubMetrics = useMemo(
    () =>
      PATIENT_HUB_METRICS.map((metric) => ({
        ...metric,
        title: isZh ? metric.titleZh : metric.titleEn,
        subtitle: isZh ? metric.subtitleZh : metric.subtitleEn,
      })),
    [isZh]
  );

  const localizedActivities = useMemo(
    () =>
      RECENT_ACTIVITY.map((item) => ({
        ...item,
        description: isZh ? item.descriptionZh : item.descriptionEn,
      })),
    [isZh]
  );

  const filteredActivities = useMemo(
    () => localizedActivities.filter((item) => item.type === activityTab),
    [localizedActivities, activityTab]
  );

  const serviceOverviewTitle = isZh ? "服务概览" : "Service Overview";
  const serviceOverviewSubtitle = isZh
    ? "依病种统计（初诊 + 复诊）"
    : "Appointments by service type (Initial + Follow-up)";
  const viewAllServicesLabel = isZh ? "查看所有服务" : "View All Services";
  const consultationsLabel = isZh ? "初诊" : "Consultations";
  const followupsLabel = isZh ? "复诊" : "Follow-ups";
  const completedCasesLabel = isZh ? "完成病例" : "Completed Cases";
  const totalAppointmentsLabel = (count: number) =>
    isZh ? `总计：${count} 次预约` : `Total: ${count} appointments`;
  const viewDetailsLabel = isZh ? "查看详情" : "View Details";
  const recentActivityTitle = isZh ? "最新动态" : "Recent Activity";
  const recentActivitySubtitle = isZh
    ? "最新的病人治疗与状态更新"
    : "Latest patient treatments and updates";
  const viewAllLabel = isZh ? "查看全部" : "View All";
  const patientHubTitle = isZh ? "病患枢纽" : "Patient Hub";
  const patientHubSubtitle = isZh ? "综合数据指标" : "Aggregated metrics";
  const todaysScheduleTitle = isZh ? "今日行程" : "Today's Schedule";
  const upcomingLabel = isZh ? "场待诊" : "upcoming";
  const fullScheduleLabel = isZh ? "查看完整排程" : "View Full Schedule";
  const visitTypeLabels = VISIT_TYPE_LABELS[language];

  const totalVisitsAcrossServices =
    getTotalAppointments(DEMO_PERIODONTAL_STATS) +
    getTotalAppointments(DEMO_COSMETIC_STATS) +
    getTotalAppointments(DEMO_IMPLANT_STATS) +
    getTotalAppointments(DEMO_ENDODONTIC_STATS);

  const totalXrays = DEMO_VISITS.length * 2 + DEMO_IMPLANT_CASES.length + DEMO_ENDODONTIC_CASES.length;
  const totalReports = DEMO_VISITS.length + DEMO_CONSULTATIONS.length;

  const upcomingSchedule = SCHEDULE_ITEMS.filter((item) => item.timestamp > Date.now()).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ id, title, value, delta, helper, Icon, iconBg, trendColor }) => (
          <Card key={id} className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBg)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={cn("text-sm font-semibold", trendColor)}>{delta}</span>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-3xl font-semibold mt-1 text-gray-900">{value}</p>
                <p className="text-sm text-gray-400 mt-2">{helper}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{serviceOverviewTitle}</h2>
            <p className="text-sm text-gray-500">{serviceOverviewSubtitle}</p>
          </div>
          <Link href="/dashboard/periodontal" className="text-sm font-medium text-blue-600 flex items-center gap-1">
            {viewAllServicesLabel}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {serviceCards.map(({ id, title, subtitle, stats, trend, href, Icon, accent, iconBg, progressColor }) => {
            const totalAppointments = getTotalAppointments(stats);
            const completionRate = totalAppointments === 0 ? 0 : stats.completed_count / totalAppointments;
            return (
              <div key={id} className={cn("rounded-3xl border border-gray-100 p-6", accent)}>
                <div className="flex items-start justify-between">
                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBg)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-white text-gray-800">
                    {trend}
                  </Badge>
                </div>
                <div className="mt-6 space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">{consultationsLabel}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.consultation_count}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{followupsLabel}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.followup_count}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{completedCasesLabel}</span>
                    <span>{stats.completed_count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/60">
                    <div
                      className={cn("h-2 rounded-full", progressColor)}
                      style={{ width: `${Math.min(100, Math.round(completionRate * 100))}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{totalAppointmentsLabel(totalAppointments)}</p>
                </div>
                <Link
                  href={href}
                  className="mt-6 inline-flex items-center text-sm font-medium text-gray-700"
                >
                  {viewDetailsLabel}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="rounded-3xl border-gray-100">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{recentActivityTitle}</CardTitle>
                <p className="text-sm text-gray-500">{recentActivitySubtitle}</p>
              </div>
              <Link href="/dashboard/patients" className="text-sm font-medium text-blue-600 flex items-center gap-1">
                {viewAllLabel}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activityTab} onValueChange={(val) => setActivityTab(val as ActivityType)}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="initial">
                  {isZh ? "初诊" : "Initial"}
                </TabsTrigger>
                <TabsTrigger value="followup">
                  {isZh ? "复诊" : "Follow-up"}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  {isZh ? "完成" : "Completed"}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="mt-6 space-y-4">
              {filteredActivities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} language={language} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-3xl border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">{patientHubTitle}</CardTitle>
            <p className="text-sm text-gray-500">{patientHubSubtitle}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {patientHubMetrics.map(({ id, title, subtitle, delta }) => {
                const Icon = PATIENT_HUB_ICONS[id as keyof typeof PATIENT_HUB_ICONS];
                const value =
                  id === "visits"
                    ? formatNumber(totalVisitsAcrossServices)
                    : id === "xrays"
                    ? formatNumber(totalXrays)
                    : formatNumber(totalReports);
                return (
                  <div key={id} className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4">
                    <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-semibold text-gray-900">{value}</p>
                      <p className="text-sm text-gray-500">{title}</p>
                      <p className="text-xs text-gray-400">{subtitle}</p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600">{delta}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-gray-100">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{todaysScheduleTitle}</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600">
              {isZh
                ? `${upcomingSchedule.length} ${upcomingLabel}`
                : `${upcomingSchedule.length} ${upcomingLabel}`}
            </Badge>
          </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSchedule.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
                  <div className="w-14">
                    <p className="text-sm font-semibold text-gray-900">{item.timeLabel}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.patientEn}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", VISIT_TYPE_STYLES[item.visitType])}>
                        {visitTypeLabels[item.visitType]}
                      </span>
                      <span>{SERVICE_LABELS[item.service][language]}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-full">
                {fullScheduleLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({
  activity,
  language,
}: {
  activity: ActivityItem & { description?: string };
  language: SupportedLanguage;
}) {
  const visitLabels = VISIT_TYPE_LABELS[language];
  const serviceLabel = SERVICE_LABELS[activity.service][language];
  const initials = getInitials(activity.patientEn);
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4">
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
        {initials}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-base font-semibold text-gray-900">{activity.patientEn}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", VISIT_TYPE_STYLES[activity.type])}>
              {visitLabels[activity.type]}
            </span>
            <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", SERVICE_TAG_STYLES[activity.service])}>
            {serviceLabel}
          </span>
          <span>{activity.description}</span>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(activity.progress * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${Math.min(100, Math.round(activity.progress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
