"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useXRays } from "@/lib/hooks/use-xrays";
import { format } from "date-fns";

interface XRayGalleryProps {
  visitId: string;
  patientId: string;
}

export function XRayGallery({ visitId, patientId }: XRayGalleryProps) {
  const { xrays, isLoading, isError, mutate } = useXRays(visitId);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (xrayId: string) => {
    if (!confirm("Are you sure you want to delete this X-ray? This action cannot be undone.")) {
      return;
    }

    setDeletingId(xrayId);
    try {
      // Mock: Simulate delete with delay
      await new Promise(resolve => setTimeout(resolve, 300));
      mutate(); // Refresh the list
    } catch (error) {
      console.error("Error deleting X-ray:", error);
      alert("Failed to delete X-ray. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading X-ray:", error);
      alert("Failed to download X-ray. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">Loading X-rays...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
        <p className="text-red-600">Error loading X-rays</p>
      </div>
    );
  }

  if (!xrays || xrays.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No X-rays uploaded yet</p>
        <p className="text-sm mt-2">Upload X-rays using the section above</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {xrays.map((xray) => (
        <div
          key={xray.id}
          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Image */}
          <div className="aspect-square bg-gray-100 relative">
            <img
              src={xray.image_url}
              alt={xray.xray_type}
              className="w-full h-full object-cover"
            />
            {/* Analysis Status Badge */}
            {xray.analysis_status === "pending" && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                Pending Analysis
              </span>
            )}
            {xray.analysis_status === "analyzed" && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                Analyzed
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-sm capitalize">
                  {xray.xray_type.replace(/_/g, " ")}
                </h4>
                <p className="text-xs text-gray-500">
                  {format(new Date(xray.uploaded_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/dashboard/compare?xray=${xray.id}&patient=${patientId}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  Compare
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(xray.image_url, `xray-${xray.id}.jpg`)}
                title="Download X-ray"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(xray.id)}
                disabled={deletingId === xray.id}
                title="Delete X-ray"
              >
                {deletingId === xray.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
