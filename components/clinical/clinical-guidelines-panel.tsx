"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, CheckSquare, AlertCircle } from "lucide-react";
import { ClinicalGuideline } from "@/lib/types/clinical";
import { getRelevantGuidelines } from "@/lib/data/clinical-guidelines";
import { ClinicalAssessment } from "@/lib/types/clinical";

interface ClinicalGuidelinesPanelProps {
  assessment?: ClinicalAssessment | null;
}

export function ClinicalGuidelinesPanel({ assessment }: ClinicalGuidelinesPanelProps) {
  const guidelines = assessment
    ? getRelevantGuidelines(assessment)
    : [];

  if (!assessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Clinical Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">
              Complete the clinical assessment to see relevant guidelines
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <strong>Evidence-Based Guidelines:</strong> The following guidelines are
              provided as clinical decision support. Always use professional judgment
              and consider individual patient circumstances.
            </div>
          </div>
        </CardContent>
      </Card>

      {guidelines.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p className="text-sm">No specific guidelines match the current assessment</p>
          </CardContent>
        </Card>
      )}

      {guidelines.map((guideline) => (
        <Card key={guideline.id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base">{guideline.title}</CardTitle>
              <Badge variant="outline" className="capitalize">
                {guideline.category.replace('_', '-')}
              </Badge>
            </div>
            {guideline.condition && (
              <p className="text-sm text-gray-600 mt-1">{guideline.condition}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Diagnostic Criteria */}
            {guideline.criteria.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Diagnostic Criteria
                </h4>
                <ul className="space-y-1">
                  {guideline.criteria.map((criterion, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Treatment Sequence */}
            {guideline.treatment_sequence && guideline.treatment_sequence.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Recommended Treatment Sequence</h4>
                <ol className="space-y-1">
                  {guideline.treatment_sequence.map((step, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Recommendations */}
            {guideline.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Clinical Recommendations</h4>
                <ul className="space-y-1">
                  {guideline.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">{index + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Source and Reference */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Source: {guideline.source}</span>
                {guideline.reference_url && (
                  <a
                    href={guideline.reference_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Reference <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
