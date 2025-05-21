// src/components/laboratories/LabBookingDialog.tsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Laboratorium } from "./types";
// Impor FormattedBookingPayload dari BookingForm.tsx atau definisikan di types.ts jika dipakai di tempat lain
import BookingForm, { FormattedBookingPayload } from "./BookingForm";

interface LabBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLab: Laboratorium | null;
  // onBookingSubmit sekarang menerima payload yang sudah diformat dari BookingForm
  onBookingSubmit: (labId: number, bookingData: FormattedBookingPayload) => void;
}

const LabBookingDialog: React.FC<LabBookingDialogProps> = ({
  open,
  onOpenChange,
  selectedLab,
  onBookingSubmit,
}) => {
  const handleSubmitFromForm = (data: FormattedBookingPayload) => { // Terima FormattedBookingPayload
    if (!selectedLab) return;
    onBookingSubmit(selectedLab.id, data);
  };

  if (!open || !selectedLab) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajukan Peminjaman Alat di Lab: {selectedLab?.nama_lab}</DialogTitle>
          <DialogDescription>
            Pilih alat, tanggal, dan tujuan peminjaman Anda.
            Jam operasional lab: {selectedLab.jam_buka || '--:--'} - {selectedLab.jam_tutup || '--:--'}.
          </DialogDescription>
        </DialogHeader>
        <BookingForm
          lab={selectedLab}
          onSubmit={handleSubmitFromForm}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LabBookingDialog;