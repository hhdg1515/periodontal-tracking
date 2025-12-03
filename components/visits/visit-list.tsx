"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { useVisits } from "@/lib/hooks/use-visits";
import { format } from "date-fns";

interface VisitListProps {
  patientId: string;
}

export function VisitList({ patientId }: VisitListProps) {
  const { visits, isLoading, isError } = useVisits(patientId);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">Loading visits...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
        <p className="text-red-600">Error loading visits</p>
      </div>
    );
  }

  if (!visits || visits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No visits recorded yet</p>
        <p className="text-sm mt-2">Click &quot;Add Visit&quot; to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visits.map((visit) => {
        const xrayCount = visit.xrays?.length || 0;
        // Analysis count would come from analysis_results - for now 0
        const analysisCount = 0;

        return (
          <Card key={visit.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">
                    {format(new Date(visit.visit_date), 'MMM dd, yyyy')}
                  </h4>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded capitalize">
                    {visit.visit_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    {xrayCount} X-ray{xrayCount !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {analysisCount} Analysis
                  </span>
                </div>
                {visit.notes && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                    {visit.notes}
                  </p>
                )}
              </div>
              <Link href={`/dashboard/patients/${patientId}/visits/${visit.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
