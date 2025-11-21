"use client";

import { Card } from "@/components/ui/card";

interface PatientReportTemplateProps {
  patientName: string;
  comparisonPeriod: string;
  findings: {
    worsening: number;
    stable: number;
    improving: number;
    averageChange: number;
  };
}

export function PatientReportTemplate({
  patientName,
  comparisonPeriod,
  findings,
}: PatientReportTemplateProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white" id="patient-report">
      {/* Header */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          YOUR GUMS: A {comparisonPeriod} COMPARISON
        </h1>
        <p className="text-xl text-gray-700">{patientName}</p>
      </div>

      {/* How Are Your Gums Doing */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">How Are Your Gums Doing?</h2>
        <div className="flex justify-around items-center my-8">
          <div className="text-center">
            <div className="text-5xl mb-2">😊</div>
            <div className="text-sm text-gray-600">
              {comparisonPeriod.split(" ")[0]} months ago
            </div>
          </div>
          <div className="text-3xl text-gray-400">→</div>
          <div className="text-center">
            <div className="text-5xl mb-2">😐</div>
            <div className="text-sm text-gray-600">Today</div>
          </div>
          <div className="text-3xl text-gray-400">→</div>
          <div className="text-center">
            <div className="text-5xl mb-2">😟</div>
            <div className="text-sm text-gray-600">
              In 6 months
              <br />
              (if untreated)
            </div>
          </div>
        </div>
      </Card>

      {/* What Changed */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">What Changed?</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600 mb-2">
              ← {comparisonPeriod.split(" ")[0]} months ago
            </div>
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400">Baseline X-ray</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600 mb-2">Today →</div>
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400">Current X-ray</span>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p className="text-red-700 font-medium">
            ⚠️ Red areas show bone loss
          </p>
        </div>
      </Card>

      {/* The Numbers */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">The Numbers</h2>
        <div className="space-y-4">
          <div>
            <p className="text-lg mb-2">
              <span className="font-bold">{findings.worsening}</span> out of{" "}
              <span className="font-bold">28</span> teeth are getting worse
            </p>
            <p className="text-lg">
              Average bone loss:{" "}
              <span className="font-bold text-red-600">
                {findings.averageChange}mm
              </span>
            </p>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>🟢 Healthy/Stable</span>
                <span className="font-semibold">{findings.stable} teeth</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(findings.stable / 28) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>🟡 Improving</span>
                <span className="font-semibold">{findings.improving} teeth</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{ width: `${(findings.improving / 28) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>🔴 Concerning</span>
                <span className="font-semibold">{findings.worsening} teeth</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: `${(findings.worsening / 28) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* What Does This Mean */}
      <Card className="p-6 mb-6 bg-yellow-50 border-yellow-200">
        <h2 className="text-2xl font-bold mb-4">What Does This Mean?</h2>
        <div className="space-y-3 text-gray-700">
          <p>Your gum disease is progressing. Without treatment:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Bone around your teeth continues to disappear</li>
            <li>Teeth may become loose</li>
            <li>You may lose teeth</li>
          </ul>
        </div>
      </Card>

      {/* Good News */}
      <Card className="p-6 mb-6 bg-green-50 border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-800">GOOD NEWS! 🎉</h2>
        <p className="text-lg text-gray-700">
          This can be stopped with treatment!
        </p>
      </Card>

      {/* Recommended Next Steps */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Recommended Next Steps</h2>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <div>
              <p className="font-semibold">Deep cleaning</p>
              <p className="text-sm text-gray-600">To remove bacteria</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <div>
              <p className="font-semibold">Better home care</p>
              <p className="text-sm text-gray-600">We&apos;ll teach you</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              3
            </span>
            <div>
              <p className="font-semibold">Come back in 3 months</p>
              <p className="text-sm text-gray-600">Track progress</p>
            </div>
          </li>
        </ol>
      </Card>

      {/* Footer */}
      <div className="text-center text-gray-600 text-sm pt-6 border-t">
        <p className="mb-2">Questions? Let&apos;s talk about your options.</p>
        <p>Generated by PerioTrack AI</p>
      </div>
    </div>
  );
}
