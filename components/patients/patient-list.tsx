"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { usePatients } from "@/lib/hooks/use-patients";
import { format } from "date-fns";

interface PatientListProps {
  searchQuery: string;
}

export function PatientList({ searchQuery }: PatientListProps) {
  const { patients, isLoading, isError } = usePatients();

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(query) ||
      patient.last_name.toLowerCase().includes(query) ||
      patient.patient_id.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <Card className="p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">Loading patients...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
        <p className="mt-4 text-red-600 font-semibold">Error loading patients</p>
        <p className="mt-2 text-sm text-gray-600">
          Please check your Supabase configuration in .env.local
        </p>
      </Card>
    );
  }

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
                    {patient.first_name[0]}
                    {patient.last_name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>ID: {patient.patient_id}</span>
                    <span>DOB: {format(new Date(patient.date_of_birth), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
