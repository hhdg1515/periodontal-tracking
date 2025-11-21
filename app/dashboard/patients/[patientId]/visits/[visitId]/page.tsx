"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2, AlertCircle } from "lucide-react";
import { XRayUploader } from "@/components/xrays/xray-uploader";
import { XRayGallery } from "@/components/xrays/xray-gallery";
import { useVisit } from "@/lib/hooks/use-visits";
import { format } from "date-fns";

export default function VisitDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const visitId = params.visitId as string;

  const { visit, isLoading, isError, mutate } = useVisit(visitId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading visit...</p>
        </div>
      </div>
    );
  }

  if (isError || !visit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Visit Not Found</h2>
          <p className="text-gray-600 mb-4">
            The visit you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href={`/dashboard/patients/${patientId}`}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

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
              <p className="text-gray-600 mt-1">
                {format(new Date(visit.visit_date), 'MMMM dd, yyyy')}
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded capitalize">
              {visit.visit_type.replace('_', ' ')}
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
          <XRayUploader visitId={visitId} onUploadComplete={() => mutate()} />
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
