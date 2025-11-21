"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface XRayComparisonViewerProps {
  baselineId: string | null;
  currentId: string | null;
  onSelectBaseline: (id: string) => void;
  onSelectCurrent: (id: string) => void;
}

export function XRayComparisonViewer({
  baselineId,
  currentId,
  onSelectBaseline,
  onSelectCurrent,
}: XRayComparisonViewerProps) {
  // Mock data - in production, fetch from Supabase
  const availableXRays = [
    {
      id: "xray-1",
      date: "2023-01-15",
      type: "Bitewing Right",
      url: "/placeholder-xray.jpg",
    },
    {
      id: "xray-2",
      date: "2023-07-20",
      type: "Bitewing Right",
      url: "/placeholder-xray.jpg",
    },
    {
      id: "xray-3",
      date: "2024-01-25",
      type: "Bitewing Right",
      url: "/placeholder-xray.jpg",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Select X-Rays to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Baseline Selection */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Baseline (Earlier)</h3>
              <div className="space-y-2">
                {availableXRays.slice(0, 2).map((xray) => (
                  <button
                    key={xray.id}
                    onClick={() => onSelectBaseline(xray.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      baselineId === xray.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <div className="font-medium text-sm">{xray.date}</div>
                        <div className="text-xs text-gray-600">{xray.type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selection */}
            <div>
              <h3 className="font-semibold mb-2 text-sm">Current (Recent)</h3>
              <div className="space-y-2">
                {availableXRays.slice(1).map((xray) => (
                  <button
                    key={xray.id}
                    onClick={() => onSelectCurrent(xray.id)}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      currentId === xray.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <div className="font-medium text-sm">{xray.date}</div>
                        <div className="text-xs text-gray-600">{xray.type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Side-by-Side Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Baseline Image */}
            <div>
              <div className="text-sm font-medium mb-2">
                Baseline {baselineId && `- 2023-01-15`}
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                {baselineId ? (
                  <img
                    src="/api/placeholder/400/400"
                    alt="Baseline X-ray"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-400">Select baseline X-ray</p>
                )}
              </div>
            </div>

            {/* Current Image */}
            <div>
              <div className="text-sm font-medium mb-2">
                Current {currentId && `- 2024-01-25`}
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
                {currentId ? (
                  <img
                    src="/api/placeholder/400/400"
                    alt="Current X-ray"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-400">Select current X-ray</p>
                )}
              </div>
            </div>
          </div>

          {baselineId && currentId && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Comparison period: <span className="font-semibold">12 months</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
