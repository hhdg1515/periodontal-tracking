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

interface AddVisitDialogProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddVisitDialog({
  patientId,
  open,
  onOpenChange,
}: AddVisitDialogProps) {
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    visitType: "followup",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Integrate with Supabase
    console.log("Adding visit for patient:", patientId, formData);

    alert("Visit added successfully! (Note: Database not connected yet)");

    // Reset form and close dialog
    setFormData({
      visitDate: new Date().toISOString().split("T")[0],
      visitType: "followup",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Visit</DialogTitle>
          <DialogDescription>
            Record a new patient visit and upload X-rays
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Visit Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visitDate" className="text-right">
                Visit Date *
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
              />
            </div>

            {/* Visit Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visitType" className="text-right">
                Visit Type *
              </Label>
              <select
                id="visitType"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.visitType}
                onChange={(e) =>
                  setFormData({ ...formData, visitType: e.target.value })
                }
                required
              >
                <option value="initial">Initial</option>
                <option value="followup">Follow-up</option>
                <option value="post_treatment">Post-Treatment</option>
              </select>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <textarea
                id="notes"
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional notes about this visit..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Visit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
