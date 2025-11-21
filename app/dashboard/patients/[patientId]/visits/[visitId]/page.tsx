"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { XRayUploader } from "@/components/xrays/xray-uploader";
import { XRayGallery } from "@/components/xrays/xray-gallery";

export default function VisitDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const visitId = params.visitId as string;

  // TODO: Fetch visit data from Supabase
  const visit = {
    id: visitId,
    visitDate: "2024-01-25",
    visitType: "Follow-up",
    notes: "6-month checkup",
  };

  return (
    <div>
      {/* Back Button */}
      <Link href={`/dashboard/patients/${patientId}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patient
        </Button>
      </Link>

      {/* Visit Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Visit Details</CardTitle>
              <p className="text-gray-600 mt-1">{visit.visitDate}</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded">
              {visit.visitType}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {visit.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-gray-700">{visit.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* X-Ray Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <Upload className="inline h-5 w-5 mr-2" />
            Upload X-Rays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <XRayUploader visitId={visitId} />
        </CardContent>
      </Card>

      {/* X-Ray Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded X-Rays</CardTitle>
        </CardHeader>
        <CardContent>
          <XRayGallery visitId={visitId} />
        </CardContent>
      </Card>
    </div>
  );
}
