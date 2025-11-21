"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { XRayComparisonViewer } from "@/components/comparison/xray-comparison-viewer";
import { AnalysisPanel } from "@/components/comparison/analysis-panel";

export default function ComparePage() {
  const [selectedBaseline, setSelectedBaseline] = useState<string | null>(null);
  const [selectedCurrent, setSelectedCurrent] = useState<string | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">X-Ray Comparison</h1>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Button disabled={!selectedBaseline || !selectedCurrent}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Comparison Viewer - 2 columns */}
        <div className="lg:col-span-2">
          <XRayComparisonViewer
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
