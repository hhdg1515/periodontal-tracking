"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XRayAnnotationViewer } from "@/components/analysis/xray-annotation-viewer";
import { analyzeXRayComparison } from "@/lib/ai/analysis-service";
import { generateDoctorReport, generatePatientReport, downloadPDF } from "@/lib/reports/pdf-generator";
import { DEMO_PATIENTS, getDemoPatientWithXRays } from "@/lib/demo/mock-data";
import { FileText, Download, Loader2, ChevronDown } from "lucide-react";
import type { AnalysisResult } from "@/lib/ai/analysis-service";

export default function DemoPage() {
  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0].id);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Get selected patient data with X-rays
  const patientData = getDemoPatientWithXRays(selectedPatientId);

  // Get X-ray URLs from mock data
  const demoBaselineImage = patientData?.baselineXRay?.imageUrl || "https://placehold.co/600x400/1e40af/white?text=Baseline+X-Ray";
  const demoCurrentImage = patientData?.currentXRay?.imageUrl || "https://placehold.co/600x400/dc2626/white?text=Current+X-Ray";

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
    if (!analysis || !patientData) return;

    setIsGeneratingReport(true);
    try {
      const baselineDate = patientData.xrays[0]?.uploadedAt || new Date();
      const currentDate = patientData.xrays[1]?.uploadedAt || new Date();

      const reportData = {
        patient: {
          first_name: patientData.patient.firstName,
          last_name: patientData.patient.lastName,
          patient_id: patientData.patient.id,
          date_of_birth: patientData.patient.dateOfBirth,
        },
        analysis,
        baselineDate: baselineDate instanceof Date ? baselineDate.toISOString().split('T')[0] : baselineDate,
        currentDate: currentDate instanceof Date ? currentDate.toISOString().split('T')[0] : currentDate,
        clinicName: "Periodontal Tracking Clinic",
        doctorName: "Dr. Analysis System",
      };

      const pdf = type === "doctor"
        ? await generateDoctorReport(reportData)
        : await generatePatientReport(reportData);

      downloadPDF(pdf, `${type}-report-${patientData.patient.id}.pdf`);
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
          AI X-Ray Analysis Demo
        </h1>
        <p className="text-gray-600 mb-6">
          Select a sample patient and click "Run AI Analysis" to see how our AI system detects and analyzes periodontal changes between baseline and current X-rays.
        </p>

        {/* Patient Selector */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Select Sample Patient:
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setAnalysis(null); // Reset analysis when changing patient
                }}
                className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DEMO_PATIENTS.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} ({patient.id})
                  </option>
                ))}
              </select>
              {patientData && (
                <div className="text-sm text-gray-600 ml-4">
                  DOB: {patientData.patient.dateOfBirth} • {patientData.patient.isSmoker ? 'Smoker' : 'Non-smoker'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo X-rays */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Baseline X-Ray
            </CardTitle>
            {patientData?.baselineXRay && (
              <p className="text-sm text-gray-600 mt-2">
                Taken: {patientData.baselineXRay.uploadedAt instanceof Date
                  ? patientData.baselineXRay.uploadedAt.toLocaleDateString()
                  : String(patientData.baselineXRay.uploadedAt)}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <img
              src={demoBaselineImage}
              alt="Baseline X-ray"
              className="w-full h-64 object-cover rounded border bg-gray-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Current X-Ray
            </CardTitle>
            {patientData?.currentXRay && (
              <p className="text-sm text-gray-600 mt-2">
                Taken: {patientData.currentXRay.uploadedAt instanceof Date
                  ? patientData.currentXRay.uploadedAt.toLocaleDateString()
                  : String(patientData.currentXRay.uploadedAt)}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <img
              src={demoCurrentImage}
              alt="Current X-ray"
              className="w-full h-64 object-cover rounded border bg-gray-100"
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
