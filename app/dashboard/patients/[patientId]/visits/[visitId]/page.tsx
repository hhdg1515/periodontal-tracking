"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Loader2, AlertCircle, Stethoscope, Image } from "lucide-react";
import { XRayUploader } from "@/components/xrays/xray-uploader";
import { XRayGallery } from "@/components/xrays/xray-gallery";
import { ClinicalAssessmentForm } from "@/components/clinical/clinical-assessment-form";
import { ClinicalGuidelinesPanel } from "@/components/clinical/clinical-guidelines-panel";
import { useVisit } from "@/lib/hooks/use-visits";
import { useClinicalAssessment } from "@/lib/hooks/use-clinical-assessment";
import { format } from "date-fns";

export default function VisitDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const visitId = params.visitId as string;

  const { visit, isLoading, isError, mutate } = useVisit(visitId);
  const { assessment, mutate: mutateAssessment } = useClinicalAssessment(visitId);
  const [activeTab, setActiveTab] = useState<string>("clinical");

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

      {/* Tabbed Interface for Clinical & X-Rays */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="clinical" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Clinical Assessment
          </TabsTrigger>
          <TabsTrigger value="xrays" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            X-Rays
          </TabsTrigger>
        </TabsList>

        {/* Clinical Assessment Tab */}
        <TabsContent value="clinical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clinical Assessment Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ClinicalAssessmentForm
                visitId={visitId}
                existingAssessment={assessment}
                onSave={() => mutateAssessment()}
              />
            </div>

            {/* Clinical Guidelines Panel - Takes 1 column */}
            <div className="lg:col-span-1">
              <ClinicalGuidelinesPanel assessment={assessment} />
            </div>
          </div>
        </TabsContent>

        {/* X-Rays Tab */}
        <TabsContent value="xrays" className="space-y-6">
          {/* X-Ray Upload Section */}
          <Card>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
