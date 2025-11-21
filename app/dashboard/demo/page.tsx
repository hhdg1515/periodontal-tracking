"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XRayAnnotationViewer } from "@/components/analysis/xray-annotation-viewer";
import { analyzeXRayComparison } from "@/lib/ai/analysis-service";
import { generateDoctorReport, generatePatientReport, downloadPDF } from "@/lib/reports/pdf-generator";
import { FileText, Download, Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/ai/analysis-service";

export default function DemoPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Demo X-ray image URLs (you can replace these with actual dental X-ray images)
  const demoBaselineImage = "https://placehold.co/600x400/1e40af/white?text=Baseline+X-Ray";
  const demoCurrentImage = "https://placehold.co/600x400/dc2626/white?text=Current+X-Ray";

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeXRayComparison(demoBaselineImage, demoCurrentImage);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async (type: "doctor" | "patient") => {
    if (!analysis) return;

    setIsGeneratingReport(true);
    try {
      const reportData = {
        patient: {
          first_name: "Demo",
          last_name: "Patient",
          patient_id: "DEMO-001",
          date_of_birth: "1980-01-01",
        },
        analysis,
        baselineDate: "2023-01-15",
        currentDate: "2024-01-15",
        clinicName: "Demo Dental Clinic",
        doctorName: "Dr. Demo",
      };

      const pdf = type === "doctor"
        ? await generateDoctorReport(reportData)
        : await generatePatientReport(reportData);

      downloadPDF(pdf, `${type}-report-demo.pdf`);
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Phase 4 Demo - AI Analysis
        </h1>
        <p className="text-gray-600">
          This demo showcases the AI-powered X-ray analysis and PDF report generation features.
        </p>
      </div>

      {/* Demo X-rays */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Baseline X-Ray (2023)</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={demoBaselineImage}
              alt="Baseline X-ray"
              className="w-full h-64 object-cover rounded border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current X-Ray (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={demoCurrentImage}
              alt="Current X-ray"
              className="w-full h-64 object-cover rounded border"
            />
          </CardContent>
        </Card>
      </div>

      {/* Analyze Button */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="lg"
              className="px-8"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Click to analyze X-rays using AI bone loss detection
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Overall Assessment */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Overall Assessment</h3>
                  <p className="text-gray-700">{analysis.overall_assessment}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <div className="text-sm text-gray-600">Average Bone Loss</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.average_bone_loss.toFixed(1)} mm
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded">
                    <div className="text-sm text-gray-600">Risk Level</div>
                    <div className="text-2xl font-bold text-orange-600 uppercase">
                      {analysis.risk_level}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded">
                    <div className="text-sm text-gray-600">Affected Teeth</div>
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.annotations.length}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Annotated X-ray */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Visual Bone Loss Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <XRayAnnotationViewer
                imageUrl={demoCurrentImage}
                annotations={analysis.annotations}
                title="Current X-Ray with AI Annotations"
              />
            </CardContent>
          </Card>

          {/* PDF Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Generate PDF Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleGenerateReport("doctor")}
                  disabled={isGeneratingReport}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Doctor Report
                </Button>
                <Button
                  onClick={() => handleGenerateReport("patient")}
                  disabled={isGeneratingReport}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Patient Report
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Download professional PDF reports with analysis results
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
