"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { ClinicalAssessment, ClinicalAssessmentInsert, PeriodontalMeasurementEntry } from "@/lib/types/clinical";
import { useLanguage } from "@/lib/i18n/language-context";
import { getDemoPeriodontalChartByVisitId } from "@/lib/demo/mock-data";

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
  const toothOptions = [
    '11','12','13','14','15','16','17','18',
    '21','22','23','24','25','26','27','28',
    '31','32','33','34','35','36','37','38',
    '41','42','43','44','45','46','47','48'
  ];
  const surfaceOptions = ['MB', 'B', 'DB', 'ML', 'L', 'DL'];
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
    periodontal_chart: getDemoPeriodontalChartByVisitId(visitId),
    // Impressions
    combined_lesion: false,
    requires_endo_evaluation: false,
    requires_perio_treatment: false,
    requires_specialist_referral: false,
  });

  const [newMeasurement, setNewMeasurement] = useState<PeriodontalMeasurementEntry>({
    tooth: '',
    surface: '',
    pocket_depth: 4,
    attachment_loss: 2,
    bleeding: false,
    priority: 'routine',
    recommended_action: 'monitor',
  });
  const periodontalChart = ((formData.periodontal_chart || []) as PeriodontalMeasurementEntry[]).sort(
    (a, b) => b.pocket_depth - a.pocket_depth || b.attachment_loss - a.attachment_loss
  );
  const highRiskSites = periodontalChart.filter((entry) => entry.pocket_depth >= 6);
  const watchSites = periodontalChart.filter((entry) => entry.pocket_depth >= 4 && entry.pocket_depth < 6);
  const bleedingSites = periodontalChart.filter((entry) => entry.bleeding);
  const getPriorityLabel = (priority: PeriodontalMeasurementEntry['priority']) =>
    t(`clinical.sections.periodontal.priority.${priority}` as const);

  const priorityBadgeStyles: Record<PeriodontalMeasurementEntry['priority'], string> = {
    urgent: 'bg-red-100 text-red-700',
    attention: 'bg-orange-100 text-orange-700',
    routine: 'bg-green-100 text-green-700',
  };

  const handleAddMeasurement = () => {
    if (!newMeasurement.tooth.trim() || !newMeasurement.surface.trim()) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      periodontal_chart: [...((prev?.periodontal_chart as PeriodontalMeasurementEntry[]) || []), newMeasurement],
    }));
    setNewMeasurement({
      tooth: '',
      surface: '',
      pocket_depth: 4,
      attachment_loss: 2,
      bleeding: false,
      priority: 'routine',
      recommended_action: 'monitor',
    });
  };

  const handleRemoveMeasurement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      periodontal_chart: ((prev?.periodontal_chart as PeriodontalMeasurementEntry[]) || []).filter((_, idx) => idx !== index),
    }));
  };

  // Load existing assessment
  useEffect(() => {
    if (existingAssessment) {
      setFormData(existingAssessment);
    } else {
      setFormData((prev) => ({
        ...prev,
        visit_id: visitId,
        periodontal_chart: getDemoPeriodontalChartByVisitId(visitId),
      }));
    }
  }, [existingAssessment, visitId]);

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

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold">{t("clinical.sections.periodontal.chartTitle")}</h4>
                <p className="text-xs text-gray-500">{t("clinical.sections.periodontal.chartSubtitle")}</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="grid md:grid-cols-4 gap-3">
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={newMeasurement.tooth}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, tooth: e.target.value })}
                >
                  <option value="">{t("clinical.sections.periodontal.table.toothPlaceholder")}</option>
                  {toothOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={newMeasurement.surface}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, surface: e.target.value })}
                >
                  <option value="">{t("clinical.sections.periodontal.table.surfacePlaceholder")}</option>
                  {surfaceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={newMeasurement.pocket_depth}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, pocket_depth: Number(e.target.value) })}
                  placeholder={t("clinical.sections.periodontal.table.depth") as string}
                />
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={newMeasurement.attachment_loss}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, attachment_loss: Number(e.target.value) })}
                  placeholder={t("clinical.sections.periodontal.table.attachment") as string}
                />
              </div>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
                  <span>{t("clinical.sections.periodontal.table.bleedLabel")}</span>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={newMeasurement.bleeding}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, bleeding: e.target.checked })}
                  />
                </div>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={newMeasurement.priority}
                  onChange={(e) =>
                    setNewMeasurement({ ...newMeasurement, priority: e.target.value as PeriodontalMeasurementEntry['priority'] })
                  }
                >
                  <option value="routine">{t("clinical.sections.periodontal.priority.routine")}</option>
                  <option value="attention">{t("clinical.sections.periodontal.priority.attention")}</option>
                  <option value="urgent">{t("clinical.sections.periodontal.priority.urgent")}</option>
                </select>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={newMeasurement.recommended_action}
                  onChange={(e) =>
                    setNewMeasurement({ ...newMeasurement, recommended_action: e.target.value as PeriodontalMeasurementEntry['recommended_action'] })
                  }
                >
                  <option value="monitor">{t("clinical.sections.periodontal.actions.monitor")}</option>
                  <option value="srp">{t("clinical.sections.periodontal.actions.srp")}</option>
                  <option value="surgery">{t("clinical.sections.periodontal.actions.surgery")}</option>
                  <option value="refer">{t("clinical.sections.periodontal.actions.refer")}</option>
                </select>
                <Button type="button" onClick={handleAddMeasurement}>
                  {t("clinical.sections.periodontal.table.addSiteButton")}
                </Button>
              </div>
            </div>
            {periodontalChart.length > 0 ? (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardContent className="py-3">
                      <p className="text-xs text-gray-500">{t("clinical.sections.periodontal.stats.critical")}</p>
                      <p className="text-2xl font-bold text-red-600">{highRiskSites.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-3">
                      <p className="text-xs text-gray-500">{t("clinical.sections.periodontal.stats.warning")}</p>
                      <p className="text-2xl font-bold text-orange-500">{watchSites.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-3">
                      <p className="text-xs text-gray-500">{t("clinical.sections.periodontal.stats.bleeding")}</p>
                      <p className="text-2xl font-bold text-blue-600">{bleedingSites.length}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                      <tr>
                        <th className="px-4 py-3 text-left">{t("clinical.sections.periodontal.table.site")}</th>
                        <th className="px-4 py-3 text-left">{t("clinical.sections.periodontal.table.depth")}</th>
                        <th className="px-4 py-3 text-left">{t("clinical.sections.periodontal.table.attachment")}</th>
                        <th className="px-4 py-3 text-left">{t("clinical.sections.periodontal.table.bleeding")}</th>
                        <th className="px-4 py-3 text-left">{t("clinical.sections.periodontal.table.priority")}</th>
                        <th className="px-4 py-3 text-left">{t("clinical.sections.periodontal.table.actionLabel")}</th>
                        <th className="px-4 py-3 text-left"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {periodontalChart.map((entry, index) => (
                        <tr key={`${entry.tooth}-${entry.surface}-${index}`} className="border-t">
                          <td className="px-4 py-2 font-medium text-gray-900">
                            #{entry.tooth} <span className="text-gray-500">{entry.surface}</span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`font-semibold ${entry.pocket_depth >= 6 ? 'text-red-600' : entry.pocket_depth >= 4 ? 'text-orange-600' : 'text-gray-800'}`}>
                              {entry.pocket_depth} mm
                            </span>
                          </td>
                          <td className="px-4 py-2">{entry.attachment_loss} mm</td>
                          <td className="px-4 py-2">
                            {entry.bleeding ? (
                              <span className="text-red-600 text-xs font-medium">{t("clinical.sections.periodontal.table.bleedingYes")}</span>
                            ) : (
                              <span className="text-gray-500 text-xs">{t("clinical.sections.periodontal.table.bleedingNo")}</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${priorityBadgeStyles[entry.priority]}`}>
                              {getPriorityLabel(entry.priority)}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {entry.recommended_action
                              ? t(`clinical.sections.periodontal.actions.${entry.recommended_action}` as const)
                              : '-'}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMeasurement(index)}>
                              {t("clinical.sections.periodontal.table.remove")}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {highRiskSites.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold mb-2">{t("clinical.sections.periodontal.riskList.title")}</h5>
                    <ul className="space-y-2">
                      {highRiskSites.map((entry, index) => (
                        <li key={`${entry.tooth}-${entry.surface}-risk-${index}`} className="flex items-start gap-3">
                          <span className="text-red-600 font-bold">{index + 1}.</span>
                          <div>
                            <p className="text-sm font-semibold">
                              #{entry.tooth} {entry.surface} — {entry.pocket_depth}mm
                            </p>
                            <p className="text-xs text-gray-600">
                              {t("clinical.sections.periodontal.riskList.recommendation")}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500 border rounded-lg px-4 py-6 text-center">
                {t("clinical.sections.periodontal.table.empty")}
              </div>
            )}
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
