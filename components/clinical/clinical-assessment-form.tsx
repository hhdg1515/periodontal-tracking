"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { ClinicalAssessment, ClinicalAssessmentInsert } from "@/lib/types/clinical";
import { clinicalAssessmentService } from "@/lib/supabase/clinical-service";

interface ClinicalAssessmentFormProps {
  visitId: string;
  existingAssessment?: ClinicalAssessment | null;
  onSaveSuccess?: () => void;
}

export function ClinicalAssessmentForm({
  visitId,
  existingAssessment,
  onSaveSuccess,
}: ClinicalAssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ClinicalAssessmentInsert>>({
    visit_id: visitId,
    // Symptoms
    spontaneous_pain: false,
    thermal_sensitivity: 'none',
    percussion_sensitivity: 'none',
    palpation_tenderness: false,
    swelling: false,
    sinus_tract: false,
    // Tests
    pulp_vitality_cold: 'not_tested',
    pulp_vitality_electric: 'not_tested',
    percussion_test: 'not_tested',
    mobility_grade: 'not_tested',
    // Periodontal
    bleeding_on_probing: false,
    furcation_involvement: 'not_assessed',
    // Impressions
    combined_lesion: false,
    requires_endo_evaluation: false,
    requires_perio_treatment: false,
    requires_specialist_referral: false,
  });

  // Load existing assessment
  useEffect(() => {
    if (existingAssessment) {
      setFormData(existingAssessment);
    }
  }, [existingAssessment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (existingAssessment?.id) {
        await clinicalAssessmentService.update(existingAssessment.id, formData);
        setSuccessMessage('Clinical assessment updated successfully');
      } else {
        await clinicalAssessmentService.create(formData as ClinicalAssessmentInsert);
        setSuccessMessage('Clinical assessment saved successfully');
      }
      onSaveSuccess?.();
    } catch (err: any) {
      console.error('Error saving assessment:', err);
      setError(err.message || 'Failed to save assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Information banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Clinical Assessment Tool:</strong> Use this form to systematically
              record clinical findings. This helps ensure comprehensive evaluation and
              proper documentation for treatment planning.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success messages */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">{successMessage}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptoms Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Patient-Reported Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Checkboxes for symptoms */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.spontaneous_pain || false}
                onChange={(e) =>
                  setFormData({ ...formData, spontaneous_pain: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Spontaneous pain</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.palpation_tenderness || false}
                onChange={(e) =>
                  setFormData({ ...formData, palpation_tenderness: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Palpation tenderness</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.swelling || false}
                onChange={(e) =>
                  setFormData({ ...formData, swelling: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Swelling</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sinus_tract || false}
                onChange={(e) =>
                  setFormData({ ...formData, sinus_tract: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Sinus tract present</span>
            </label>
          </div>

          {/* Thermal sensitivity */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Thermal Sensitivity</Label>
            <div className="flex gap-3">
              {['none', 'mild', 'severe'].map((level) => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="thermal_sensitivity"
                    value={level}
                    checked={formData.thermal_sensitivity === level}
                    onChange={(e) =>
                      setFormData({ ...formData, thermal_sensitivity: e.target.value as any })
                    }
                  />
                  <span className="text-sm capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Percussion sensitivity */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Percussion Sensitivity</Label>
            <div className="flex gap-3">
              {['none', 'mild', 'severe'].map((level) => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="percussion_sensitivity"
                    value={level}
                    checked={formData.percussion_sensitivity === level}
                    onChange={(e) =>
                      setFormData({ ...formData, percussion_sensitivity: e.target.value as any })
                    }
                  />
                  <span className="text-sm capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clinical Tests Performed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pulp vitality - Cold test */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Pulp Vitality - Cold Test
            </Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'not_tested', label: 'Not Tested', color: 'text-gray-600' },
                { value: 'positive', label: 'Positive', color: 'text-green-600' },
                { value: 'delayed', label: 'Delayed', color: 'text-yellow-600' },
                { value: 'negative', label: 'Negative', color: 'text-red-600' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pulp_vitality_cold"
                    value={option.value}
                    checked={formData.pulp_vitality_cold === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, pulp_vitality_cold: e.target.value as any })
                    }
                  />
                  <span className={`text-sm ${option.color}`}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Percussion test */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Percussion Test</Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'not_tested', label: 'Not Tested' },
                { value: 'normal', label: 'Normal' },
                { value: 'sensitive', label: 'Sensitive' },
                { value: 'painful', label: 'Painful' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="percussion_test"
                    value={option.value}
                    checked={formData.percussion_test === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, percussion_test: e.target.value as any })
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mobility */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Tooth Mobility</Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'not_tested', label: 'Not Tested' },
                { value: 'normal', label: 'Normal (Grade 0)' },
                { value: 'grade_1', label: 'Grade I' },
                { value: 'grade_2', label: 'Grade II' },
                { value: 'grade_3', label: 'Grade III' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mobility_grade"
                    value={option.value}
                    checked={formData.mobility_grade === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, mobility_grade: e.target.value as any })
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Periodontal Measurements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Periodontal Measurements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pocket_depth" className="text-sm font-medium">
                Maximum Pocket Depth (mm)
              </Label>
              <Input
                id="pocket_depth"
                type="number"
                min="0"
                max="15"
                value={formData.pocket_depth_max || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pocket_depth_max: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="e.g., 5"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: ≤3mm</p>
            </div>

            <div>
              <Label htmlFor="attachment_loss" className="text-sm font-medium">
                Maximum Attachment Loss (mm)
              </Label>
              <Input
                id="attachment_loss"
                type="number"
                min="0"
                max="15"
                value={formData.attachment_loss_max || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attachment_loss_max: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="e.g., 4"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Concern if &gt;3mm</p>
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.bleeding_on_probing || false}
              onChange={(e) =>
                setFormData({ ...formData, bleeding_on_probing: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium">Bleeding on Probing (BOP)</span>
          </label>

          {/* Furcation involvement */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Furcation Involvement</Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'not_assessed', label: 'Not Assessed' },
                { value: 'none', label: 'None' },
                { value: 'grade_1', label: 'Grade I' },
                { value: 'grade_2', label: 'Grade II' },
                { value: 'grade_3', label: 'Grade III' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="furcation_involvement"
                    value={option.value}
                    checked={formData.furcation_involvement === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, furcation_involvement: e.target.value as any })
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Impression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clinical Impression</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Perio status */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Periodontal Status</Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'healthy', label: 'Healthy' },
                { value: 'gingivitis', label: 'Gingivitis' },
                { value: 'mild', label: 'Mild Periodontitis' },
                { value: 'moderate', label: 'Moderate Periodontitis' },
                { value: 'severe', label: 'Severe Periodontitis' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="perio_status"
                    value={option.value}
                    checked={formData.perio_status === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, perio_status: e.target.value as any })
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Endo concern */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Endodontic Concern</Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'none', label: 'None' },
                { value: 'suspected', label: 'Suspected' },
                { value: 'confirmed', label: 'Confirmed' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="endo_concern"
                    value={option.value}
                    checked={formData.endo_concern === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, endo_concern: e.target.value as any })
                    }
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.combined_lesion || false}
              onChange={(e) =>
                setFormData({ ...formData, combined_lesion: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium">
              Perio-Endo Combined Lesion Suspected
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Follow-up Needs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Follow-up Needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requires_endo_evaluation || false}
              onChange={(e) =>
                setFormData({ ...formData, requires_endo_evaluation: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium">Requires Endodontic Evaluation</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requires_perio_treatment || false}
              onChange={(e) =>
                setFormData({ ...formData, requires_perio_treatment: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium">Requires Periodontal Treatment</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requires_specialist_referral || false}
              onChange={(e) =>
                setFormData({ ...formData, requires_specialist_referral: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium">Requires Specialist Referral</span>
          </label>

          {formData.requires_specialist_referral && (
            <div className="ml-6">
              <Label className="text-sm font-medium mb-2 block">Referral To</Label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { value: 'endodontist', label: 'Endodontist' },
                  { value: 'periodontist', label: 'Periodontist' },
                  { value: 'oral_surgeon', label: 'Oral Surgeon' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="referral_specialty"
                      value={option.value}
                      checked={formData.referral_specialty === option.value}
                      onChange={(e) =>
                        setFormData({ ...formData, referral_specialty: e.target.value as any })
                      }
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clinical_notes" className="text-sm font-medium">
              General Clinical Notes
            </Label>
            <textarea
              id="clinical_notes"
              rows={4}
              value={formData.clinical_notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, clinical_notes: e.target.value })
              }
              placeholder="Document clinical findings, patient history, and any relevant observations..."
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <Label htmlFor="differential_diagnosis" className="text-sm font-medium">
              Differential Diagnosis / Considerations
            </Label>
            <textarea
              id="differential_diagnosis"
              rows={3}
              value={formData.differential_diagnosis || ''}
              onChange={(e) =>
                setFormData({ ...formData, differential_diagnosis: e.target.value })
              }
              placeholder="List potential diagnoses and clinical reasoning..."
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          {existingAssessment ? 'Update Assessment' : 'Save Assessment'}
        </Button>
      </div>
    </form>
  );
}
