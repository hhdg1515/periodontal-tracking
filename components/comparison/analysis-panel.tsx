"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, Minus, FileText, Loader2, Sparkles } from "lucide-react";
import { useXRay } from "@/lib/hooks/use-xrays-for-comparison";
import { analyzeXRayComparison, AnalysisResult } from "@/lib/ai/analysis-service";
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
      alert('Failed to analyze X-rays. Please try again.');
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
          <CardTitle className="text-lg">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">Select both X-rays to see AI analysis</p>
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
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-blue-600 animate-pulse" />
            <p className="text-sm text-gray-600">AI is analyzing the X-rays...</p>
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
          <CardTitle className="text-lg">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze with AI
            </Button>
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risk Level */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Risk Level</div>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
                analysis.risk_level === "high"
                  ? "bg-red-100 text-red-700"
                  : analysis.risk_level === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {analysis.risk_level.toUpperCase()}
            </span>
          </div>

          {/* Average Change */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Average Bone Loss</div>
            <div className="text-2xl font-bold text-red-600">
              +{analysis.average_bone_loss.toFixed(1)} mm
            </div>
          </div>

          {/* Teeth Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm">Affected Areas</span>
              </div>
              <span className="font-semibold">{analysis.annotations.length}</span>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-700">{analysis.overall_assessment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detected Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analysis.annotations.map((annotation, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${
                  annotation.severity === 'severe'
                    ? 'bg-red-50 border-red-200'
                    : annotation.severity === 'moderate'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold">Tooth #{annotation.tooth_number}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      annotation.severity === "severe"
                        ? "bg-red-100 text-red-700"
                        : annotation.severity === "moderate"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {annotation.severity}
                  </span>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold text-red-700">
                    {annotation.bone_loss_mm}mm
                  </span>
                  {' '}bone loss
                </div>
                <p className="text-xs text-gray-600">{annotation.description}</p>
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
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">{index + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
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
          Generate Patient Report
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleGenerateReport('doctor')}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <FileText className="h-4 w-4 mr-2" />
          Generate Doctor Report
        </Button>
      </div>
    </div>
  );
}
