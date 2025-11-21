"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2 } from "lucide-react";
import Link from "next/link";

interface XRay {
  id: string;
  type: string;
  url: string;
  uploadDate: string;
}

interface XRayGalleryProps {
  visitId: string;
}

export function XRayGallery({ visitId }: XRayGalleryProps) {
  const [xrays, setXrays] = useState<XRay[]>([]);

  useEffect(() => {
    // TODO: Fetch X-rays from Supabase
    setXrays([]);
  }, [visitId]);

  if (xrays.length === 0) {
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
              src={xray.url}
              alt={xray.type}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-sm">
                  {xray.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </h4>
                <p className="text-xs text-gray-500">{xray.uploadDate}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/dashboard/compare?xray=${xray.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  Compare
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
