"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Calendar } from "lucide-react";
import { VisitList } from "@/components/visits/visit-list";
import { AddVisitDialog } from "@/components/visits/add-visit-dialog";
import { usePatient } from "@/lib/hooks/use-patients";
import { useVisits } from "@/lib/hooks/use-visits";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);

  // Fetch patient data
  const { patient: patientData } = usePatient(patientId);
  const { visits } = useVisits(patientId);

  // Use fetched patient data or fallback
  const patient = patientData || {
    id: patientId,
    patient_id: "P-12345",
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "1980-05-15",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    is_smoker: false,
    has_diabetes: false,
  };

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
                  <dd className="font-medium">{patient.date_of_birth}</dd>
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
                <p className="text-2xl font-bold">{visits.length}</p>
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
                <p className="text-2xl font-bold">{visits.length * 2}</p>
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
                <p className="text-2xl font-bold">{visits.length}</p>
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
      />
    </div>
  );
}
