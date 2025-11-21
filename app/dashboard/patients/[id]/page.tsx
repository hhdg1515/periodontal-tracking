"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Calendar, Loader2, AlertCircle } from "lucide-react";
import { VisitList } from "@/components/visits/visit-list";
import { AddVisitDialog } from "@/components/visits/add-visit-dialog";
import { usePatient } from "@/lib/hooks/use-patients";
import { useVisits } from "@/lib/hooks/use-visits";
import { format } from "date-fns";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);

  const { patient, isLoading: patientLoading, isError: patientError } = usePatient(patientId);
  const { visits, isLoading: visitsLoading, mutate: refreshVisits } = useVisits(patientId);

  // Calculate stats
  const stats = useMemo(() => {
    const totalVisits = visits?.length || 0;
    const totalXrays = visits?.reduce((acc, visit) => acc + (visit.xrays?.length || 0), 0) || 0;
    // Reports would come from analysis_results table - for now hardcoded to 0
    const totalReports = 0;

    return { totalVisits, totalXrays, totalReports };
  }, [visits]);

  const handleVisitAdded = () => {
    refreshVisits();
  };

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading patient...</p>
        </div>
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">
            The patient you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Link href="/dashboard/patients">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Link href="/dashboard/patients">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
      </Link>

      {/* Patient Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {patient.first_name} {patient.last_name}
              </CardTitle>
              <p className="text-gray-600 mt-1">Patient ID: {patient.patient_id}</p>
            </div>
            <Button variant="outline">Edit Patient</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex">
                  <dt className="w-32 text-gray-600">Date of Birth:</dt>
                  <dd className="font-medium">{format(new Date(patient.date_of_birth), 'MMM dd, yyyy')}</dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-gray-600">Email:</dt>
                  <dd className="font-medium">{patient.email || "N/A"}</dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-gray-600">Phone:</dt>
                  <dd className="font-medium">{patient.phone || "N/A"}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Risk Factors</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      patient.is_smoker ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></span>
                  <span>Smoker: {patient.is_smoker ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      patient.has_diabetes ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></span>
                  <span>Diabetes: {patient.has_diabetes ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Visits</p>
                {visitsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold">{stats.totalVisits}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Upload className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">X-rays Uploaded</p>
                {visitsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold">{stats.totalXrays}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold">{stats.totalReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visits Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Visit History</CardTitle>
            <Button onClick={() => setIsAddVisitOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Add Visit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VisitList patientId={patientId} />
        </CardContent>
      </Card>

      {/* Add Visit Dialog */}
      <AddVisitDialog
        patientId={patientId}
        open={isAddVisitOpen}
        onOpenChange={setIsAddVisitOpen}
        onSuccess={handleVisitAdded}
      />
    </div>
  );
}
