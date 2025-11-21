"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, AlertCircle } from "lucide-react";

interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  lastVisit?: string;
  riskLevel?: "low" | "medium" | "high";
}

interface PatientListProps {
  searchQuery: string;
}

export function PatientList({ searchQuery }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // TODO: Fetch from Supabase
    // For now, use mock data
    setPatients([]);
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.patientId.toLowerCase().includes(query)
    );
  });

  if (patients.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No patients yet</h3>
        <p className="text-gray-600 mb-4">
          Click the &quot;Add Patient&quot; button to get started
        </p>
      </Card>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <Card className="p-12 text-center">
        <h3 className="text-lg font-semibold mb-2">No patients found</h3>
        <p className="text-gray-600">Try adjusting your search query</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPatients.map((patient) => (
        <Card key={patient.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {patient.firstName[0]}
                    {patient.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>ID: {patient.patientId}</span>
                    <span>DOB: {patient.dateOfBirth}</span>
                    {patient.lastVisit && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last visit: {patient.lastVisit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {patient.riskLevel && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    patient.riskLevel === "high"
                      ? "bg-red-100 text-red-700"
                      : patient.riskLevel === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {patient.riskLevel.toUpperCase()} RISK
                </span>
              )}
              <Link href={`/dashboard/patients/${patient.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
