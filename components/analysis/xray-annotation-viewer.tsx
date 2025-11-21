"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BoneLossAnnotation } from "@/lib/ai/analysis-service";

interface XRayAnnotationViewerProps {
  imageUrl: string;
  annotations: BoneLossAnnotation[];
  title?: string;
}

export function XRayAnnotationViewer({
  imageUrl,
  annotations,
  title = "Annotated X-Ray",
}: XRayAnnotationViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [hoveredAnnotation, setHoveredAnnotation] = useState<BoneLossAnnotation | null>(null);
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

    // Draw annotations
    annotations.forEach((annotation, index) => {
      const x = (annotation.region.x / 100) * canvas.width;
      const y = (annotation.region.y / 100) * canvas.height;
      const width = (annotation.region.width / 100) * canvas.width;
      const height = (annotation.region.height / 100) * canvas.height;

      // Set color based on severity
      let color = '';
      switch (annotation.severity) {
        case 'mild':
          color = 'rgba(251, 191, 36, 0.5)'; // Yellow
          break;
        case 'moderate':
          color = 'rgba(249, 115, 22, 0.5)'; // Orange
          break;
        case 'severe':
          color = 'rgba(239, 68, 68, 0.5)'; // Red
          break;
      }

      // Draw rectangle
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);

      // Draw border
      ctx.strokeStyle = color.replace('0.5', '1');
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw tooth number label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`#${annotation.tooth_number}`, x + 5, y + 20);

      // Draw bone loss measurement
      ctx.fillText(`${annotation.bone_loss_mm}mm`, x + 5, y + 40);
    });
  }, [imageLoaded, annotations]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
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
          <div className="mt-4 flex gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm">Mild (&lt;1mm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">Moderate (1-2mm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Severe (&gt;2mm)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annotation List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detected Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {annotations.map((annotation, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredAnnotation(annotation)}
                onMouseLeave={() => setHoveredAnnotation(null)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Tooth #{annotation.tooth_number}</span>
                      <Badge
                        variant={
                          annotation.severity === 'severe'
                            ? 'destructive'
                            : annotation.severity === 'moderate'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {annotation.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{annotation.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {annotation.bone_loss_mm}mm
                    </div>
                    <div className="text-xs text-gray-500">bone loss</div>
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
