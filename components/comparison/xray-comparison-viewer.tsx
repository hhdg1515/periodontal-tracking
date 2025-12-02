"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { useXRaysForComparison, useXRay } from "@/lib/hooks/use-xrays-for-comparison";
import { format } from "date-fns";

interface XRayComparisonViewerProps {
  patientId: string | null;
  baselineId: string | null;
  currentId: string | null;
  onSelectBaseline: (id: string) => void;
  onSelectCurrent: (id: string) => void;
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
    return diffMonths > 0 ? `${diffMonths} month${diffMonths !== 1 ? 's' : ''}` : `${diffDays} days`;
  }, [baselineXRay, currentXRay]);

  if (!patientId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select X-Rays to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No patient selected. Please select a patient from the dashboard.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select X-Rays to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Loading X-rays...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select X-Rays to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading X-rays</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!xrays || xrays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select X-Rays to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No X-rays available for this patient.</p>
            <p className="text-xs mt-2">Upload X-rays from a patient visit to begin comparison.</p>
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
          <CardTitle>Select X-Rays to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Baseline Selection */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Baseline (Earlier)</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {xrays.map((xray) => {
                  // @ts-ignore - visit is included in the query
                  const visitDate = xray.visit?.visit_date || xray.uploaded_at;
                  return (
                    <button
                      key={xray.id}
                      onClick={() => onSelectBaseline(xray.id)}
                      disabled={currentId === xray.id}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        baselineId === xray.id
                          ? "border-blue-500 bg-blue-50"
                          : currentId === xray.id
                          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
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
                            {xray.xray_type.replace(/_/g, ' ')}
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
              <h3 className="font-semibold mb-2 text-sm">Current (Recent)</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {xrays.map((xray) => {
                  // @ts-ignore - visit is included in the query
                  const visitDate = xray.visit?.visit_date || xray.uploaded_at;
                  return (
                    <button
                      key={xray.id}
                      onClick={() => onSelectCurrent(xray.id)}
                      disabled={baselineId === xray.id}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        currentId === xray.id
                          ? "border-blue-500 bg-blue-50"
                          : baselineId === xray.id
                          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
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
                            {xray.xray_type.replace(/_/g, ' ')}
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
          <CardTitle>Side-by-Side Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Baseline Image */}
            <div>
              <div className="text-sm font-medium mb-2">
                Baseline
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
                    alt="Baseline X-ray"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-400">Select baseline X-ray</p>
                )}
              </div>
            </div>

            {/* Current Image */}
            <div>
              <div className="text-sm font-medium mb-2">
                Current
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
                    alt="Current X-ray"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-400">Select current X-ray</p>
                )}
              </div>
            </div>
          </div>

          {comparisonPeriod && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Comparison period: <span className="font-semibold">{comparisonPeriod}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
