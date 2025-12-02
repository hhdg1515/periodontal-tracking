"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { ClinicalAssessment, ClinicalAssessmentInsert } from "@/lib/types/clinical";
import { useLanguage } from "@/lib/i18n/language-context";

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
  const { t } = useLanguage();

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
      // Mock: Simulate saving clinical assessment
      await new Promise(resolve => setTimeout(resolve, 300));

      if (existingAssessment?.id) {
        setSuccessMessage(t("clinical.success.updated"));
      } else {
        setSuccessMessage(t("clinical.success.created"));
      }
      onSaveSuccess?.();
    } catch (err: any) {
      console.error('Error saving assessment:', err);
      setError(err.message || t("clinical.errors.saveFailed"));
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
              <strong>{t("clinical.banner.title")}</strong> {t("clinical.banner.description")}
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
          <CardTitle className="text-lg">{t("clinical.sections.symptoms.title")}</CardTitle>
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
              <span className="text-sm font-medium">{t("clinical.sections.symptoms.labels.spontaneousPain")}</span>
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
              <span className="text-sm font-medium">{t("clinical.sections.symptoms.labels.palpationTenderness")}</span>
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
              <span className="text-sm font-medium">{t("clinical.sections.symptoms.labels.swelling")}</span>
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
              <span className="text-sm font-medium">{t("clinical.sections.symptoms.labels.sinusTract")}</span>
            </label>
          </div>

          {/* Thermal sensitivity */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.symptoms.thermalLabel")}</Label>
            <div className="flex gap-3">
              {["none", "mild", "severe"].map((level) => (
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
                  <span className="text-sm capitalize">{t(`clinical.sections.symptoms.levels.${level}`)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Percussion sensitivity */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.symptoms.percussionLabel")}</Label>
            <div className="flex gap-3">
              {["none", "mild", "severe"].map((level) => (
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
                  <span className="text-sm capitalize">{t(`clinical.sections.symptoms.levels.${level}`)}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("clinical.sections.tests.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pulp vitality - Cold test */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t("clinical.sections.tests.pulpVitalityCold")}
            </Label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: "not_tested", color: "text-gray-600" },
                { value: "positive", color: "text-green-600" },
                { value: "delayed", color: "text-yellow-600" },
                { value: "negative", color: "text-red-600" },
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
                  <span className={`text-sm ${option.color}`}>
                    {t(`clinical.sections.tests.pulpOptions.${option.value}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Percussion test */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.tests.percussionTest")}</Label>
            <div className="flex gap-3 flex-wrap">
              {["not_tested", "normal", "sensitive", "painful"].map((value) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="percussion_test"
                    value={value}
                    checked={formData.percussion_test === value}
                    onChange={(e) =>
                      setFormData({ ...formData, percussion_test: e.target.value as any })
                    }
                  />
                  <span className="text-sm">
                    {t(`clinical.sections.tests.percussionOptions.${value}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Mobility */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.tests.mobility")}</Label>
            <div className="flex gap-3 flex-wrap">
              {["not_tested", "normal", "grade_1", "grade_2", "grade_3"].map((value) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mobility_grade"
                    value={value}
                    checked={formData.mobility_grade === value}
                    onChange={(e) =>
                      setFormData({ ...formData, mobility_grade: e.target.value as any })
                    }
                  />
                  <span className="text-sm">
                    {t(`clinical.sections.tests.mobilityOptions.${value}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Periodontal Measurements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("clinical.sections.periodontal.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pocket_depth" className="text-sm font-medium">
                {t("clinical.sections.periodontal.pocketDepth")}
              </Label>
              <Input
                id="pocket_depth"
                type="number"
                min="0"
                max="15"
                value={formData.pocket_depth_max || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pocket_depth_max: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="e.g., 5"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">{t("clinical.sections.periodontal.pocketHelper")}</p>
            </div>

            <div>
              <Label htmlFor="attachment_loss" className="text-sm font-medium">
                {t("clinical.sections.periodontal.attachmentLoss")}
              </Label>
              <Input
                id="attachment_loss"
                type="number"
                min="0"
                max="15"
                value={formData.attachment_loss_max || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attachment_loss_max: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="e.g., 4"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">{t("clinical.sections.periodontal.attachmentHelper")}</p>
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
            <span className="text-sm font-medium">{t("clinical.sections.periodontal.bleeding")}</span>
          </label>

          {/* Furcation involvement */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.periodontal.furcation")}</Label>
            <div className="flex gap-3 flex-wrap">
              {["not_assessed", "none", "grade_1", "grade_2", "grade_3"].map((value) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="furcation_involvement"
                    value={value}
                    checked={formData.furcation_involvement === value}
                    onChange={(e) =>
                      setFormData({ ...formData, furcation_involvement: e.target.value as any })
                    }
                  />
                  <span className="text-sm">
                    {t(`clinical.sections.periodontal.furcationOptions.${value}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Impression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("clinical.sections.impression.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Perio status */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.impression.perioStatus")}</Label>
            <div className="flex gap-3 flex-wrap">
              {["healthy", "gingivitis", "mild", "moderate", "severe"].map((value) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="perio_status"
                    value={value}
                    checked={formData.perio_status === value}
                    onChange={(e) =>
                      setFormData({ ...formData, perio_status: e.target.value as any })
                    }
                  />
                  <span className="text-sm">
                    {t(`clinical.sections.impression.perioOptions.${value}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Endo concern */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.impression.endoConcern")}</Label>
            <div className="flex gap-3 flex-wrap">
              {["none", "suspected", "confirmed"].map((value) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="endo_concern"
                    value={value}
                    checked={formData.endo_concern === value}
                    onChange={(e) =>
                      setFormData({ ...formData, endo_concern: e.target.value as any })
                    }
                  />
                  <span className="text-sm">
                    {t(`clinical.sections.impression.endoOptions.${value}`)}
                  </span>
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
              {t("clinical.sections.impression.combinedLesion")}
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Follow-up Needs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("clinical.sections.followUp.title")}</CardTitle>
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
            <span className="text-sm font-medium">{t("clinical.sections.followUp.endo")}</span>
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
            <span className="text-sm font-medium">{t("clinical.sections.followUp.perio")}</span>
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
            <span className="text-sm font-medium">{t("clinical.sections.followUp.referral")}</span>
          </label>

          {formData.requires_specialist_referral && (
            <div className="ml-6">
              <Label className="text-sm font-medium mb-2 block">{t("clinical.sections.followUp.referralTo")}</Label>
              <div className="flex gap-3 flex-wrap">
                {["endodontist", "periodontist", "oral_surgeon"].map((value) => (
                  <label key={value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="referral_specialty"
                      value={value}
                      checked={formData.referral_specialty === value}
                      onChange={(e) =>
                        setFormData({ ...formData, referral_specialty: e.target.value as any })
                      }
                    />
                    <span className="text-sm">
                      {t(`clinical.sections.followUp.referralOptions.${value}`)}
                    </span>
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
          <CardTitle className="text-lg">{t("clinical.sections.notes.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clinical_notes" className="text-sm font-medium">
              {t("clinical.sections.notes.general")}
            </Label>
            <textarea
              id="clinical_notes"
              rows={4}
              value={formData.clinical_notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, clinical_notes: e.target.value })
              }
              placeholder={t("clinical.sections.notes.generalPlaceholder")}
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <Label htmlFor="differential_diagnosis" className="text-sm font-medium">
              {t("clinical.sections.notes.differential")}
            </Label>
            <textarea
              id="differential_diagnosis"
              rows={3}
              value={formData.differential_diagnosis || ""}
              onChange={(e) =>
                setFormData({ ...formData, differential_diagnosis: e.target.value })
              }
              placeholder={t("clinical.sections.notes.differentialPlaceholder")}
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
          {existingAssessment ? t("clinical.buttons.update") : t("clinical.buttons.save")}
        </Button>
      </div>
    </form>
  );
}
