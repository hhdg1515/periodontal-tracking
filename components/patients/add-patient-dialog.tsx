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

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPatientDialog({ open, onOpenChange }: AddPatientDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    isSmoker: false,
    hasDiabetes: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Integrate with Supabase
    console.log("Adding patient:", formData);

    // For now, just show an alert
    alert("Patient added successfully! (Note: Database not connected yet)");

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter patient information to create a new record
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* First Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name *
              </Label>
              <Input
                id="firstName"
                className="col-span-3"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>

            {/* Last Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name *
              </Label>
              <Input
                id="lastName"
                className="col-span-3"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right">
                Date of Birth *
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
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="patient@example.com"
              />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                className="col-span-3"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(123) 456-7890"
              />
            </div>

            {/* Risk Factors */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Risk Factors</Label>
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
                  />
                  <Label htmlFor="isSmoker" className="font-normal">
                    Smoker
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
                  />
                  <Label htmlFor="hasDiabetes" className="font-normal">
                    Diabetes
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
