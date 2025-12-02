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
import { useLanguage } from "@/lib/i18n/language-context";

interface AddVisitDialogProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddVisitDialog({
  patientId,
  open,
  onOpenChange,
  onSuccess,
}: AddVisitDialogProps) {
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    visitType: "followup",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Mock: Store visit in memory/localStorage
      const newVisit = {
        id: `visit-${Date.now()}`,
        patient_id: patientId,
        visit_date: formData.visitDate,
        visit_type: formData.visitType,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Reset form and close dialog
      setFormData({
        visitDate: new Date().toISOString().split("T")[0],
        visitType: "followup",
        notes: "",
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      console.error("Error creating visit:", err);
      setError(err.message || t("addVisitDialog.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addVisitDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("addVisitDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="col-span-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Visit Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visitDate" className="text-right">
                {t("addVisitDialog.fields.visitDate")}
              </Label>
              <Input
                id="visitDate"
                type="date"
                className="col-span-3"
                value={formData.visitDate}
                onChange={(e) =>
                  setFormData({ ...formData, visitDate: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Visit Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visitType" className="text-right">
                {t("addVisitDialog.fields.visitType")}
              </Label>
              <select
                id="visitType"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                value={formData.visitType}
                onChange={(e) =>
                  setFormData({ ...formData, visitType: e.target.value })
                }
                required
                disabled={isSubmitting}
              >
                <option value="initial">{t("visitList.visitTypes.initial")}</option>
                <option value="followup">{t("visitList.visitTypes.followup")}</option>
                <option value="post_treatment">{t("visitList.visitTypes.post_treatment")}</option>
              </select>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                {t("addVisitDialog.fields.notes")}
              </Label>
              <textarea
                id="notes"
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder={t("addVisitDialog.placeholders.notes")}
                disabled={isSubmitting}
              />
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
                ? t("addVisitDialog.buttons.submitting")
                : t("addVisitDialog.buttons.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
