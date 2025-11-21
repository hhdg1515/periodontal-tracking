"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChangeIndicator } from "@/lib/ai/analysis-service";
import { AlertCircle } from "lucide-react";

interface XRayAnnotationViewerProps {
  imageUrl: string;
  indicators: ChangeIndicator[];
  title?: string;
}

export function XRayAnnotationViewer({
  imageUrl,
  indicators,
  title = "Annotated X-Ray",
}: XRayAnnotationViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [hoveredIndicator, setHoveredIndicator] = useState<ChangeIndicator | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the X-ray image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw indicator overlays
    indicators.forEach((indicator, index) => {
      const x = (indicator.region.x / 100) * canvas.width;
      const y = (indicator.region.y / 100) * canvas.height;
      const width = (indicator.region.width / 100) * canvas.width;
      const height = (indicator.region.height / 100) * canvas.height;

      // Set color based on change level
      let color = '';
      switch (indicator.change_level) {
        case 'minimal':
          color = 'rgba(251, 191, 36, 0.4)'; // Yellow
          break;
        case 'moderate':
          color = 'rgba(249, 115, 22, 0.4)'; // Orange
          break;
        case 'significant':
          color = 'rgba(239, 68, 68, 0.4)'; // Red
          break;
      }

      // Draw rectangle overlay
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);

      // Draw border
      ctx.strokeStyle = color.replace('0.4', '1');
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw region label (not tooth number for ethical reasons)
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 12px sans-serif';

      const label = `Region ${index + 1}`;
      ctx.strokeText(label, x + 5, y + 18);
      ctx.fillText(label, x + 5, y + 18);
    });
  }, [imageLoaded, indicators]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="space-y-4">
      {/* Demo Warning */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-900">
              <strong>Demo Mode:</strong> Overlays show general areas of interest, not precise
              measurements. Professional diagnostic tools required for clinical use.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Hidden image for loading */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="X-ray"
              className="hidden"
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
            />

            {/* Canvas for annotations */}
            <canvas
              ref={canvasRef}
              className="w-full h-auto border rounded-lg"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 flex gap-4 justify-center flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm">Minimal Change</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Moderate Change</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Significant Change</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicator List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observed Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {indicators.map((indicator, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                  indicator.change_level === 'significant'
                    ? 'border-red-200'
                    : indicator.change_level === 'moderate'
                    ? 'border-orange-200'
                    : 'border-yellow-200'
                }`}
                onMouseEnter={() => setHoveredIndicator(indicator)}
                onMouseLeave={() => setHoveredIndicator(null)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{indicator.tooth_region}</span>
                      <Badge
                        variant={
                          indicator.change_level === 'significant'
                            ? 'destructive'
                            : indicator.change_level === 'moderate'
                            ? 'default'
                            : 'secondary'
                        }
                        className="capitalize"
                      >
                        {indicator.change_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{indicator.description}</p>
                  </div>
                  <div className="text-right ml-3">
                    <div className={`text-sm font-semibold ${
                      indicator.priority === 'urgent' ? 'text-red-600' :
                      indicator.priority === 'attention' ? 'text-orange-600' :
                      'text-blue-600'
                    }`}>
                      {indicator.priority}
                    </div>
                    <div className="text-xs text-gray-500">priority</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
