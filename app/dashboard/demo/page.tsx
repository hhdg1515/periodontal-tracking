"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XRayAnnotationViewer } from "@/components/analysis/xray-annotation-viewer";
import { analyzeXRayComparison } from "@/lib/ai/analysis-service";
import { DEMO_PATIENTS, getDemoPatientWithXRays } from "@/lib/demo/mock-data";
import { FileText, Download, Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/ai/analysis-service";
import { useLanguage } from "@/lib/i18n/language-context";

let pdfModulePromise: Promise<typeof import("@/lib/reports/pdf-generator")> | null = null;

async function loadPdfModule() {
  if (!pdfModulePromise) {
    pdfModulePromise = import("@/lib/reports/pdf-generator");
  }
  return pdfModulePromise;
}

export default function DemoPage() {
  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0].id);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { t, language } = useLanguage();

  // Get selected patient data with X-rays
  const patientData = getDemoPatientWithXRays(selectedPatientId);

  // Get X-ray URLs from mock data
  const demoBaselineImage = patientData?.baselineXRay?.imageUrl || "https://placehold.co/600x400/1e40af/white?text=Baseline+X-Ray";
  const demoCurrentImage = patientData?.currentXRay?.imageUrl || "https://placehold.co/600x400/dc2626/white?text=Current+X-Ray";

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeXRayComparison(demoBaselineImage, demoCurrentImage, language);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(t("demo.errors.analysisFailed"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async (type: "doctor" | "patient") => {
    if (!analysis || !patientData) return;

    setIsGeneratingReport(true);
    try {
      const { generateDoctorReport, generatePatientReport, downloadPDF } = await loadPdfModule();
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
        clinicName: t("demo.reportMeta.clinicName"),
        doctorName: t("demo.reportMeta.doctorName"),
      };

      const pdf = type === "doctor"
        ? await generateDoctorReport(reportData)
        : await generatePatientReport(reportData);

      downloadPDF(pdf, `${type}-report-${patientData.patient.id}.pdf`);
    } catch (error) {
      console.error("Report generation failed:", error);
      alert(t("demo.errors.reportFailed"));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const patientStatus =
    patientData && patientData.patient.isSmoker ? t("demo.smoker") : t("demo.nonSmoker");

  useEffect(() => {
    if (analysis?.is_demo_data) {
      setAnalysis(null);
    }
  }, [language]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("demo.title")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("demo.description")}
        </p>

        {/* Patient Selector */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                {t("demo.selectLabel")}
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
                  {t("demo.patientDetails", {
                    dob: patientData.patient.dateOfBirth,
                    status: patientStatus,
                  })}
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
              {t("demo.baselineTitle")}
            </CardTitle>
            {patientData?.baselineXRay && (
              <p className="text-sm text-gray-600 mt-2">
                {t("demo.takenLabel")}{" "}
                {patientData.baselineXRay.uploadedAt instanceof Date
                  ? patientData.baselineXRay.uploadedAt.toLocaleDateString()
                  : String(patientData.baselineXRay.uploadedAt)}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <img
              src={demoBaselineImage}
              alt={t("demo.baselineTitle")}
              className="w-full h-64 object-cover rounded border bg-gray-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("demo.currentTitle")}
            </CardTitle>
            {patientData?.currentXRay && (
              <p className="text-sm text-gray-600 mt-2">
                {t("demo.takenLabel")}{" "}
                {patientData.currentXRay.uploadedAt instanceof Date
                  ? patientData.currentXRay.uploadedAt.toLocaleDateString()
                  : String(patientData.currentXRay.uploadedAt)}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <img
              src={demoCurrentImage}
              alt={t("demo.currentTitle")}
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
                  {t("demo.analyzing")}
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  {t("demo.analyzeButton")}
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              {t("demo.analyzeHint")}
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
              <CardTitle>{t("demo.resultsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t("demo.overallSummary")}</h3>
                  <p className="text-gray-700">{analysis.overall_summary}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <div className="text-sm text-gray-600">{t("demo.healthScore")}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.health_score.toFixed(1)}/10
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded">
                    <div className="text-sm text-gray-600">{t("demo.concernLevel")}</div>
                    <div className="text-2xl font-bold text-orange-600 uppercase">
                      {analysis.concern_level}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded">
                    <div className="text-sm text-gray-600">{t("demo.areasDetected")}</div>
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.indicators.length}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t("demo.discussionPoints")}</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {analysis.discussion_points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Annotated X-ray */}
          {analysis.indicators && analysis.indicators.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("demo.visualAnalysisTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <XRayAnnotationViewer
                  imageUrl={demoCurrentImage}
                  indicators={analysis.indicators}
                  title={t("demo.viewerTitle")}
                />
              </CardContent>
            </Card>
          )}

          {/* PDF Reports */}
          <Card>
            <CardHeader>
              <CardTitle>{t("demo.pdfTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleGenerateReport("doctor")}
                  disabled={isGeneratingReport}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("demo.doctorReport")}
                </Button>
                <Button
                  onClick={() => handleGenerateReport("patient")}
                  disabled={isGeneratingReport}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("demo.patientReport")}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t("demo.pdfDescription")}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
