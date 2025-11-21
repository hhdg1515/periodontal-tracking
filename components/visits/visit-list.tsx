"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Upload, FileText } from "lucide-react";

interface Visit {
  id: string;
  visitDate: string;
  visitType: string;
  xrayCount: number;
  analysisCount: number;
}

interface VisitListProps {
  patientId: string;
}

export function VisitList({ patientId }: VisitListProps) {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    // TODO: Fetch visits from Supabase
    setVisits([]);
  }, [patientId]);

  if (visits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No visits recorded yet</p>
        <p className="text-sm mt-2">Click &quot;Add Visit&quot; to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <Card key={visit.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h4 className="font-semibold">{visit.visitDate}</h4>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                  {visit.visitType}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  {visit.xrayCount} X-rays
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {visit.analysisCount} Analyses
                </span>
              </div>
            </div>
            <Link href={`/dashboard/patients/${patientId}/visits/${visit.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
