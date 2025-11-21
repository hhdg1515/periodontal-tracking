"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowDown, ArrowUp, Minus, FileText, Loader2, Info } from "lucide-react";
import { useXRay } from "@/lib/hooks/use-xrays-for-comparison";
import { analyzeXRayComparison, AnalysisResult, SYSTEM_CAPABILITIES } from "@/lib/ai/analysis-service";
import { generateDoctorReport, generatePatientReport, downloadPDF } from "@/lib/reports/pdf-generator";
import { format } from "date-fns";

interface AnalysisPanelProps {
  baselineId: string | null;
  currentId: string | null;
}

export function AnalysisPanel({ baselineId, currentId }: AnalysisPanelProps) {
  const hasComparison = baselineId && currentId;
  const { xray: baselineXRay } = useXRay(baselineId);
  const { xray: currentXRay } = useXRay(currentId);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Automatically analyze when both X-rays are selected
  useEffect(() => {
    if (baselineXRay && currentXRay && !analysis) {
      handleAnalyze();
    }
  }, [baselineXRay, currentXRay]);

  const handleAnalyze = async () => {
    if (!baselineXRay || !currentXRay) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeXRayComparison(
        baselineXRay.file_url,
        currentXRay.file_url
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to generate comparison insights. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async (type: 'patient' | 'doctor') => {
    if (!analysis || !baselineXRay || !currentXRay) return;

    setIsGeneratingReport(true);
    try {
      // Mock patient info - in production, fetch from database
      const patientInfo = {
        name: 'John Smith',
        patientId: 'JS-001',
        dateOfBirth: '1975-03-15',
        phone: '(555) 123-4567',
        email: 'john.smith@example.com',
      };

      const reportData = {
        patient: patientInfo,
        analysis,
        // @ts-ignore
        baselineDate: format(new Date(baselineXRay.visit?.visit_date || baselineXRay.upload_date), 'MMM dd, yyyy'),
        // @ts-ignore
        currentDate: format(new Date(currentXRay.visit?.visit_date || currentXRay.upload_date), 'MMM dd, yyyy'),
        clinicName: 'Demo Dental Clinic',
        doctorName: 'Sarah Johnson',
      };

      const pdfBlob = type === 'patient'
        ? await generatePatientReport(reportData)
        : await generateDoctorReport(reportData);

      const filename = `${type}-report-${patientInfo.patientId}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(pdfBlob, filename);
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (!hasComparison) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comparison Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">Select both X-rays to see comparison insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analyzing...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 mx-auto mb-3 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Generating comparison insights...</p>
            <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comparison Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Comparison Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* DEMO MODE WARNING */}
      {analysis.is_demo_data && showDisclaimer && (
        <Card className="border-2 border-orange-400 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 mb-1">
                  🎭 Demo Mode
                </h4>
                <p className="text-sm text-orange-800 mb-2">
                  This shows sample data for demonstration only. Not for clinical use.
                </p>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="text-xs text-orange-700 hover:text-orange-900 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Comparison Insights
              {analysis.is_demo_data && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  Demo
                </span>
              )}
            </CardTitle>
            <span className="text-xs text-gray-500">
              Confidence: {analysis.confidence}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bone Health Score */}
          <div>
            <div className="text-sm text-gray-600 mb-2">Bone Health Score</div>
            <div className="flex items-end gap-3">
              <div className="text-4xl font-bold text-blue-600">
                {analysis.health_score.toFixed(1)}
                <span className="text-xl text-gray-500">/10</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {analysis.score_change < 0 ? (
                  <>
                    <ArrowDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600 font-medium">
                      {Math.abs(analysis.score_change).toFixed(1)}
                    </span>
                  </>
                ) : analysis.score_change > 0 ? (
                  <>
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      +{analysis.score_change.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <>
                    <Minus className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">
                      No change
                    </span>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Compared to baseline
            </p>
          </div>

          {/* Concern Level */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Concern Level</div>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                analysis.concern_level === "high"
                  ? "bg-red-100 text-red-700"
                  : analysis.concern_level === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {analysis.concern_level.toUpperCase()}
            </span>
          </div>

          {/* Areas Summary */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Areas Flagged</span>
              <span className="font-semibold">{analysis.indicators.length}</span>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-700">{analysis.overall_summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Detected Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observed Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analysis.indicators.map((indicator, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${
                  indicator.change_level === 'significant'
                    ? 'bg-red-50 border-red-200'
                    : indicator.change_level === 'moderate'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">{indicator.tooth_region}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded capitalize ${
                      indicator.change_level === "significant"
                        ? "bg-red-100 text-red-700"
                        : indicator.change_level === "moderate"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {indicator.change_level}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{indicator.description}</p>
                <span className={`text-xs font-medium ${
                  indicator.priority === 'urgent' ? 'text-red-700' :
                  indicator.priority === 'attention' ? 'text-orange-700' :
                  'text-blue-700'
                }`}>
                  Priority: {indicator.priority}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discussion Points */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discussion Points for Your Dentist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {analysis.discussion_points.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">{index + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              <strong>Note:</strong> These insights are generated from visual comparison only.
              Professional measurement and examination are required for accurate diagnosis.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          className="w-full"
          onClick={() => handleGenerateReport('patient')}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <FileText className="h-4 w-4 mr-2" />
          Download Sample Patient Report
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleGenerateReport('doctor')}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <FileText className="h-4 w-4 mr-2" />
          Download Sample Doctor Report
        </Button>
        <p className="text-xs text-center text-gray-500 pt-1">
          Reports include demo watermarks
        </p>
      </div>
    </div>
  );
}
