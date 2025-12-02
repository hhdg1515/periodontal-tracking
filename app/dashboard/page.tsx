"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats";
import { useLanguage } from "@/lib/i18n/language-context";

export default function DashboardPage() {
  const { stats, isLoading, isError } = useDashboardStats();
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("dashboard.title")}</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.stats.totalPatients.title")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : isError ? (
              <div className="text-2xl font-bold text-red-600">--</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalPatients === 0
                    ? t("dashboard.stats.totalPatients.zero")
                    : t("dashboard.stats.totalPatients.description")}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Analyses This Month */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.stats.analyses.title")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : isError ? (
              <div className="text-2xl font-bold text-red-600">--</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.analysesThisMonth || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.analysesThisMonth === 0
                    ? t("dashboard.stats.analyses.zero")
                    : t("dashboard.stats.analyses.description")}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Treatment Acceptance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.stats.acceptance.title")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : isError ? (
              <div className="text-2xl font-bold text-red-600">--</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.treatmentAcceptanceRate !== null
                    ? `${stats?.treatmentAcceptanceRate}%`
                    : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.treatmentAcceptanceRate !== null
                    ? t("dashboard.stats.acceptance.description")
                    : t("dashboard.stats.acceptance.noData")}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.stats.reviews.title")}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : isError ? (
              <div className="text-2xl font-bold text-red-600">--</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.pendingReviews || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.pendingReviews === 0
                    ? t("dashboard.stats.reviews.zero")
                    : t("dashboard.stats.reviews.description")}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.quickStart.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold">{t("dashboard.quickStart.steps.addPatient.title")}</h3>
                <p className="text-sm text-gray-600">
                  {t("dashboard.quickStart.steps.addPatient.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">{t("dashboard.quickStart.steps.uploadXrays.title")}</h3>
                <p className="text-sm text-gray-400">
                  {t("dashboard.quickStart.steps.uploadXrays.description")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">{t("dashboard.quickStart.steps.runAnalysis.title")}</h3>
                <p className="text-sm text-gray-400">
                  {t("dashboard.quickStart.steps.runAnalysis.description")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
