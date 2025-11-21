"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AnalysisPanelProps {
  baselineId: string | null;
  currentId: string | null;
}

export function AnalysisPanel({ baselineId, currentId }: AnalysisPanelProps) {
  const hasComparison = baselineId && currentId;

  // Mock analysis data
  const analysisData = {
    totalTeeth: 28,
    worsening: 8,
    stable: 18,
    improving: 2,
    averageChange: 0.8,
    riskLevel: "medium" as const,
  };

  if (!hasComparison) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">Select both X-rays to see analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risk Level */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Risk Level</div>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
                analysisData.riskLevel === "high"
                  ? "bg-red-100 text-red-700"
                  : analysisData.riskLevel === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {analysisData.riskLevel.toUpperCase()}
            </span>
          </div>

          {/* Average Change */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Average Bone Loss</div>
            <div className="text-2xl font-bold text-red-600">
              +{analysisData.averageChange} mm
            </div>
          </div>

          {/* Teeth Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm">Worsening</span>
              </div>
              <span className="font-semibold">{analysisData.worsening}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Stable</span>
              </div>
              <span className="font-semibold">{analysisData.stable}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Improving</span>
              </div>
              <span className="font-semibold">{analysisData.improving}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { tooth: 18, change: 1.3, severity: "moderate" },
              { tooth: 14, change: 0.9, severity: "mild" },
              { tooth: 31, change: 1.1, severity: "moderate" },
            ].map((finding) => (
              <div
                key={finding.tooth}
                className="p-3 border rounded-lg bg-red-50 border-red-200"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold">Tooth #{finding.tooth}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      finding.severity === "moderate"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {finding.severity}
                  </span>
                </div>
                <div className="text-sm text-red-700">
                  +{finding.change}mm bone loss
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Deep cleaning (SRP) for teeth #18, #14, #31</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Enhanced home care instructions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Follow-up in 3 months</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Button className="w-full">Generate Patient Report</Button>
      <Button variant="outline" className="w-full">
        Generate Doctor Report
      </Button>
    </div>
  );
}
