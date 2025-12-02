"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { DEMO_CLINIC_ID } from "@/lib/hooks/use-patients";
import { useLanguage } from "@/lib/i18n/language-context";

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddPatientDialog({ open, onOpenChange, onSuccess }: AddPatientDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    isSmoker: false,
    hasDiabetes: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Auto-generate patient ID from first name, last name, and timestamp
      const timestamp = Date.now().toString().slice(-6);
      const patientId = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}-${timestamp}`.toUpperCase();

      const newPatient = {
        id: patientId,
        patient_id: patientId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        email: formData.email || null,
        phone: formData.phone || null,
        is_smoker: formData.isSmoker,
        has_diabetes: formData.hasDiabetes,
        clinic_id: DEMO_CLINIC_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in localStorage to persist added patients
      const storedPatientsJson = localStorage.getItem('mock_patients');
      const storedPatients = storedPatientsJson ? JSON.parse(storedPatientsJson) : [];
      storedPatients.push(newPatient);
      localStorage.setItem('mock_patients', JSON.stringify(storedPatients));

      // Reset form and close dialog
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        isSmoker: false,
        hasDiabetes: false,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      console.error("Error creating patient:", err);
      setError(err.message || t("addPatientDialog.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addPatientDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("addPatientDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="col-span-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* First Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                {t("addPatientDialog.fields.firstName")}
              </Label>
              <Input
                id="firstName"
                className="col-span-3"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Last Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                {t("addPatientDialog.fields.lastName")}
              </Label>
              <Input
                id="lastName"
                className="col-span-3"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right">
                {t("addPatientDialog.fields.dateOfBirth")}
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                className="col-span-3"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t("addPatientDialog.fields.email")}
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t("addPatientDialog.placeholders.email")}
                disabled={isSubmitting}
              />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                {t("addPatientDialog.fields.phone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                className="col-span-3"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder={t("addPatientDialog.placeholders.phone")}
                disabled={isSubmitting}
              />
            </div>

            {/* Risk Factors */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">{t("addPatientDialog.fields.riskFactors")}</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isSmoker"
                    checked={formData.isSmoker}
                    onChange={(e) =>
                      setFormData({ ...formData, isSmoker: e.target.checked })
                    }
                    className="rounded"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="isSmoker" className="font-normal">
                    {t("addPatientDialog.fields.smoker")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasDiabetes"
                    checked={formData.hasDiabetes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hasDiabetes: e.target.checked,
                      })
                    }
                    className="rounded"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="hasDiabetes" className="font-normal">
                    {t("addPatientDialog.fields.diabetes")}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.actions.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isSubmitting
                ? t("addPatientDialog.buttons.submitting")
                : t("addPatientDialog.buttons.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
