"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { XRayComparisonViewer } from "@/components/comparison/xray-comparison-viewer";
import { AnalysisPanel } from "@/components/comparison/analysis-panel";
import { useXRay } from "@/lib/hooks/use-xrays-for-comparison";
import { useLanguage } from "@/lib/i18n/language-context";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const xrayId = searchParams.get('xray');
  const patientId = searchParams.get('patient');

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patientId);
  const [selectedBaseline, setSelectedBaseline] = useState<string | null>(null);
  const [selectedCurrent, setSelectedCurrent] = useState<string | null>(null);
  const { t } = useLanguage();

  // If xray ID is provided in URL, fetch it and set as current
  const { xray } = useXRay(xrayId);

  useEffect(() => {
    if (xray) {
      setSelectedCurrent(xray.id);
      // @ts-ignore - visit is included in the query
      if (xray.visit?.patient_id) {
        // @ts-ignore
        setSelectedPatientId(xray.visit.patient_id);
      }
    }
  }, [xray]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t("comparison.page.title")}</h1>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("comparison.page.back")}
            </Button>
          </Link>
          <Button disabled={!selectedBaseline || !selectedCurrent}>
            <FileText className="h-4 w-4 mr-2" />
            {t("comparison.page.generateReport")}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Comparison Viewer - 2 columns */}
        <div className="lg:col-span-2">
          <XRayComparisonViewer
            patientId={selectedPatientId}
            baselineId={selectedBaseline}
            currentId={selectedCurrent}
            onSelectBaseline={setSelectedBaseline}
            onSelectCurrent={setSelectedCurrent}
          />
        </div>

        {/* Analysis Panel - 1 column */}
        <div>
          <AnalysisPanel
            baselineId={selectedBaseline}
            currentId={selectedCurrent}
          />
        </div>
      </div>
    </div>
  );
}
