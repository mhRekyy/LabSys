// src/components/laboratories/LabDetailsDialog.tsx
import React from 'react';
import { Laboratorium } from './types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format, parseISO } from "date-fns";
import { Loader2, Edit3, PackagePlus } from "lucide-react";

interface LabDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lab: Laboratorium | null;
  isLoading: boolean;
  onConfirmStatusChange: (labId: number, newStatus: "Open" | "Closed") => void;
  onBookLab: (lab: Laboratorium) => void; // Fungsi untuk booking
  canManageAccess: boolean; // True jika Admin atau Aslab (untuk ubah status)
  canBookFromDialog: boolean; // True jika role saat ini boleh booking dari dialog ini
}

const formatDateSafe = (dateString: string | null | undefined, formatPattern: string = "dd MMMM yyyy, HH:mm"): string => {
    if (!dateString) return 'N/A';
    try {
        const date = parseISO(dateString);
        if (isNaN(date.getTime())) {
            console.warn("LabDetailsDialog: Invalid date string for formatting:", dateString);
            return "Format Tanggal Tidak Valid";
        }
        return format(date, formatPattern);
    } catch (e) {
        console.error("LabDetailsDialog: Error parsing date:", dateString, e);
        return "Kesalahan Format Tanggal";
    }
};

const LabDetailsDialog: React.FC<LabDetailsDialogProps> = ({
  open, onOpenChange, lab, isLoading, onConfirmStatusChange, onBookLab, canManageAccess, canBookFromDialog
}) => {

  if (!open) return null;

  const DialogRenderContent: React.FC = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /><p className="ml-2">Memuat detail...</p></div>;
    }
    if (!lab) {
      return <div className="py-10 text-center text-muted-foreground">Detail laboratorium tidak dapat dimuat atau tidak ditemukan.</div>;
    }

    const newStatusToSet = lab.status === 'Open' ? 'Closed' : 'Open';
    const actionButtonText = lab.status === 'Open' ? 'Tutup Lab Ini' : 'Buka Lab Ini';
    const actionButtonVariant = lab.status === 'Open' ? 'destructive' : 'default';

    const handleInternalStatusChangeConfirm = () => {
      if (lab && typeof lab.id === 'number' && !isNaN(lab.id)) {
        onConfirmStatusChange(lab.id, newStatusToSet);
      } else {
        toast.error("Gagal mengubah status: Informasi lab tidak lengkap.");
      }
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-xl">{lab.nama_lab}</DialogTitle>
          <DialogDescription>Detail lengkap untuk laboratorium {lab.nama_lab}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4 text-sm my-4 border-t border-b border-border pt-6 pb-6">
          <div className="flex justify-between"><span className="text-muted-foreground w-1/3">ID Lab:</span><span className="font-medium w-2/3 text-right">{lab.id}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground w-1/3">Lokasi:</span><span className="w-2/3 text-right">{lab.lokasi_gedung} - {lab.lokasi_ruang}</span></div>
          {lab.type_lab && (<div className="flex justify-between"><span className="text-muted-foreground w-1/3">Tipe Lab:</span><span className="w-2/3 text-right">{lab.type_lab}</span></div>)}
          <div className="flex justify-between"><span className="text-muted-foreground w-1/3">Kapasitas:</span><span className="w-2/3 text-right">{lab.kapasitas} orang</span></div>
          <div className="flex justify-between items-center"><span className="text-muted-foreground w-1/3">Status:</span><div className="w-2/3 text-right"><Badge variant={lab.status === 'Open' ? 'default' : 'destructive'}>{lab.status}</Badge></div></div>
          <div className="flex justify-between"><span className="text-muted-foreground w-1/3">Jam Operasional:</span><span className="w-2/3 text-right">{lab.jam_buka || '--:--'} - {lab.jam_tutup || '--:--'}</span></div>
          {lab.deskripsi_singkat && (<div className="flex flex-col"><span className="text-muted-foreground mb-1">Deskripsi:</span><p className="text-sm">{lab.deskripsi_singkat}</p></div>)}
          {lab.fasilitas_utama && (<div className="flex flex-col mt-2"><span className="text-muted-foreground mb-1">Fasilitas Utama:</span><p className="text-sm">{lab.fasilitas_utama}</p></div>)}
          <div className="text-xs text-muted-foreground mt-4 space-y-1">
            <p>Dibuat: {formatDateSafe(lab.created_at)}</p>
            <p>Diperbarui: {formatDateSafe(lab.updated_at)}</p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-2">
          <DialogClose asChild><Button type="button" variant="outline" className="w-full sm:w-auto order-last sm:order-first">Tutup</Button></DialogClose>
          {!isLoading && lab && ( // Hanya tampilkan tombol aksi jika tidak loading dan ada data lab
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Tombol Ubah Status HANYA JIKA canManageAccess true */}
              {canManageAccess && (
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant={actionButtonVariant} className="w-full sm:w-auto"><Edit3 className="mr-2 h-4 w-4" />{actionButtonText}</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Konfirmasi Perubahan Status</AlertDialogTitle><AlertDialogDescription>Apakah Anda yakin ingin mengubah status lab "{lab.nama_lab}" menjadi "{newStatusToSet}"?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleInternalStatusChangeConfirm}>Ya, Ubah Status</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Tombol Booking HANYA JIKA canBookFromDialog true DAN lab Open */}
              {canBookFromDialog && lab.status === 'Open' && typeof onBookLab === 'function' && (
                <Button onClick={() => onBookLab(lab)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <PackagePlus className="mr-2 h-4 w-4" /> Booking Lab
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <DialogRenderContent />
      </DialogContent>
    </Dialog>
  );
};
export default LabDetailsDialog;