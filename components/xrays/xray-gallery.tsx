"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useXRays } from "@/lib/hooks/use-xrays";
import { format } from "date-fns";
import { useLanguage } from "@/lib/i18n/language-context";

interface XRayGalleryProps {
  visitId: string;
  patientId: string;
}

export function XRayGallery({ visitId, patientId }: XRayGalleryProps) {
  const { xrays, isLoading, isError, mutate } = useXRays(visitId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { t } = useLanguage();
  const getTypeLabel = (type: string) => {
    const key = `xrays.types.${type}` as const;
    const translated = t(key);
    return translated === key ? type.replace(/_/g, " ") : translated;
  };

  const handleDelete = async (xrayId: string) => {
    if (!confirm(t("xrays.gallery.deleteConfirm"))) {
      return;
    }

    setDeletingId(xrayId);
    try {
      // Mock: Simulate delete with delay
      await new Promise(resolve => setTimeout(resolve, 300));
      mutate(); // Refresh the list
    } catch (error) {
      console.error("Error deleting X-ray:", error);
      alert(t("xrays.gallery.deleteError"));
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
      alert(t("xrays.gallery.downloadError"));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">{t("xrays.gallery.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-8 w-8 mx-auto text-red-600 mb-2" />
        <p className="text-red-600">{t("xrays.gallery.error")}</p>
      </div>
    );
  }

  if (!xrays || xrays.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>{t("xrays.gallery.emptyTitle")}</p>
        <p className="text-sm mt-2">{t("xrays.gallery.emptyDescription")}</p>
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
                {t("xrays.gallery.pending")}
              </span>
            )}
            {xray.analysis_status === "analyzed" && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                {t("xrays.gallery.analyzed")}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-sm capitalize">
                  {getTypeLabel(xray.xray_type)}
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
                  {t("xrays.gallery.compare")}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(xray.image_url, `xray-${xray.id}.jpg`)}
                title={t("xrays.gallery.downloadTooltip")}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(xray.id)}
                disabled={deletingId === xray.id}
                title={t("xrays.gallery.deleteTooltip")}
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
