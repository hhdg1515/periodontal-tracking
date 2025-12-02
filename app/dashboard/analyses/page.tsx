"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, User } from "lucide-react";

export default function AnalysesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analysis History
        </h1>
        <p className="text-gray-600">
          View past X-ray analyses and treatment recommendations
        </p>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Analyses Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            When you analyze X-rays for your patients, the results will appear here as a historical record.
          </p>
          <p className="text-sm text-gray-500">
            Go to the Demo page or select a patient to get started with your first analysis.
          </p>
        </CardContent>
      </Card>

      {/* Coming Soon: Analytics Section */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">0</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Patients Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">0</div>
            <p className="text-xs text-gray-500 mt-1">Unique patients</p>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">0</div>
            <p className="text-xs text-gray-500 mt-1">PDF reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
