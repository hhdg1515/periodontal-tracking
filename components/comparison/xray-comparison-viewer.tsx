"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { useXRaysForComparison, useXRay } from "@/lib/hooks/use-xrays-for-comparison";
import { format } from "date-fns";
import { useLanguage } from "@/lib/i18n/language-context";

interface XRayComparisonViewerProps {
  patientId: string | null;
  baselineId: string | null;
  currentId: string | null;
  onSelectBaseline: (id: string | null) => void;
  onSelectCurrent: (id: string | null) => void;
}

export function XRayComparisonViewer({
  patientId,
  baselineId,
  currentId,
  onSelectBaseline,
  onSelectCurrent,
}: XRayComparisonViewerProps) {
  const { xrays, isLoading, isError } = useXRaysForComparison(patientId);
  const { xray: baselineXRay } = useXRay(baselineId);
  const { xray: currentXRay } = useXRay(currentId);
  const { t } = useLanguage();
  const baselineType = baselineXRay?.xray_type ?? null;

  // Calculate time difference between selected X-rays
  const comparisonPeriod = useMemo(() => {
    if (!baselineXRay || !currentXRay) return null;
    // @ts-ignore - visit is included in the query
    const baselineDate = new Date(baselineXRay.visit?.visit_date || baselineXRay.upload_date);
    // @ts-ignore
    const currentDate = new Date(currentXRay.visit?.visit_date || currentXRay.upload_date);
    const diffTime = Math.abs(currentDate.getTime() - baselineDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.round(diffDays / 30);
    if (diffMonths > 0) {
      return diffMonths === 1
        ? t("comparison.viewer.periodMonthSingle", { count: diffMonths })
        : t("comparison.viewer.periodMonthMultiple", { count: diffMonths });
    }
    return diffDays === 1
      ? t("comparison.viewer.periodDaySingle", { count: diffDays })
      : t("comparison.viewer.periodDayMultiple", { count: diffDays });
  }, [baselineXRay, currentXRay, t]);

  const getXRayTypeLabel = (type: string) => {
    const key = `xrays.types.${type}` as const;
    const translated = t(key);
    if (translated === key) {
      return type.replace(/_/g, " ");
    }
    return translated;
  };

  useEffect(() => {
    if (!baselineXRay || !xrays) return;
    if (currentXRay && currentXRay.xray_type === baselineXRay.xray_type) {
      return;
    }
    const candidates = xrays
      .filter((x) => x.xray_type === baselineXRay.xray_type && x.id !== baselineXRay.id)
      .sort((a, b) => {
        const dateA = new Date((a.visit?.visit_date || a.uploaded_at) as string).getTime();
        const dateB = new Date((b.visit?.visit_date || b.uploaded_at) as string).getTime();
        return dateB - dateA;
      });
    if (candidates.length > 0) {
      onSelectCurrent(candidates[0].id);
    } else {
      onSelectCurrent(null);
    }
  }, [baselineXRay, currentXRay, xrays, onSelectCurrent]);

  if (!patientId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("comparison.viewer.selectTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">{t("comparison.viewer.noPatientMessage")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("comparison.viewer.selectTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">{t("comparison.viewer.loading")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("comparison.viewer.selectTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{t("comparison.viewer.error")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!xrays || xrays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("comparison.viewer.selectTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">{t("comparison.viewer.emptyTitle")}</p>
            <p className="text-xs mt-2">{t("comparison.viewer.emptyDescription")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle>{t("comparison.viewer.selectTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Baseline Selection */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">{t("comparison.viewer.baselineHeading")}</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {xrays.map((xray) => {
                  // @ts-ignore - visit is included in the query
                  const visitDate = xray.visit?.visit_date || xray.uploaded_at;
                  return (
                    <button
                      key={xray.id}
                      onClick={() => onSelectBaseline(xray.id)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        baselineId === xray.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">
                            {format(new Date(visitDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-600 capitalize">
                            {getXRayTypeLabel(xray.xray_type)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Selection */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">{t("comparison.viewer.currentHeading")}</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {xrays.map((xray) => {
                  // @ts-ignore - visit is included in the query
                  const visitDate = xray.visit?.visit_date || xray.uploaded_at;
                  const isTypeMismatch = baselineType && xray.xray_type !== baselineType;
                  return (
                    <button
                      key={xray.id}
                      onClick={() => !isTypeMismatch && onSelectCurrent(xray.id)}
                      disabled={Boolean(isTypeMismatch)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        isTypeMismatch
                          ? "border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed"
                          : currentId === xray.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">
                            {format(new Date(visitDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-600 capitalize">
                            {getXRayTypeLabel(xray.xray_type)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>{t("comparison.viewer.comparisonTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Baseline Image */}
            <div>
              <div className="text-sm font-medium mb-2">
                {t("comparison.viewer.baselineLabel")}
                {baselineXRay && (
                  <>
                    {' - '}
                    {/* @ts-ignore */}
                    {format(new Date(baselineXRay.visit?.visit_date || baselineXRay.uploaded_at), 'MMM dd, yyyy')}
                  </>
                )}
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                {baselineXRay ? (
                  <img
                    src={baselineXRay.image_url}
                    alt={`${t("comparison.viewer.baselineLabel")} X-ray`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-400">{t("comparison.viewer.selectBaselinePlaceholder")}</p>
                )}
              </div>
            </div>

            {/* Current Image */}
            <div>
              <div className="text-sm font-medium mb-2">
                {t("comparison.viewer.currentLabel")}
                {currentXRay && (
                  <>
                    {' - '}
                    {/* @ts-ignore */}
                    {format(new Date(currentXRay.visit?.visit_date || currentXRay.uploaded_at), 'MMM dd, yyyy')}
                  </>
                )}
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                {currentXRay ? (
                  <img
                    src={currentXRay.image_url}
                    alt={`${t("comparison.viewer.currentLabel")} X-ray`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-400">{t("comparison.viewer.selectCurrentPlaceholder")}</p>
                )}
              </div>
            </div>
          </div>

          {comparisonPeriod && (
            <div className="mt-4 text-center text-sm text-gray-600">
              {t("comparison.viewer.comparisonPeriodLabel")}{" "}
              <span className="font-semibold">{comparisonPeriod}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
