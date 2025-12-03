"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText, Calendar } from "lucide-react";
import { VisitList } from "@/components/visits/visit-list";
import { AddVisitDialog } from "@/components/visits/add-visit-dialog";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);

  // TODO: Fetch patient data from Supabase
  const patient = {
    id: patientId,
    patientId: "P-12345",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1980-05-15",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    isSmoker: false,
    hasDiabetes: false,
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
                {patient.firstName} {patient.lastName}
              </CardTitle>
              <p className="text-gray-600 mt-1">Patient ID: {patient.patientId}</p>
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
                  <dd className="font-medium">{patient.dateOfBirth}</dd>
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
                      patient.isSmoker ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></span>
                  <span>Smoker: {patient.isSmoker ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      patient.hasDiabetes ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></span>
                  <span>Diabetes: {patient.hasDiabetes ? "Yes" : "No"}</span>
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
                <p className="text-2xl font-bold">0</p>
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
                <p className="text-2xl font-bold">0</p>
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
                <p className="text-2xl font-bold">0</p>
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
