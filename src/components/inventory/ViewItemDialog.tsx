// src/components/inventory/ViewItemDialog.tsx (REVISI LENGKAP FINAL)

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Pastikan Input diimpor
import { Label } from "@/components/ui/label"; // Pastikan Label diimpor
import { Package, MapPin, Edit, Calendar, Info, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns"; // Pastikan date-fns terinstall
import { toast } from "sonner";


// --- Tipe Data dari Backend ---
// Idealnya ini diimpor dari file tipe bersama (misal: src/types/index.ts)
interface KategoriType {
  id: number;
  nama_kategori: string;
}
interface InventarisType {
  id: number;
  nama_alat: string;
  kategori: KategoriType | null;
  kondisi: string;
  jumlah: number;
  lokasi?: string | null;
  deskripsi?: string | null;
  nomor_seri?: string | null;
  tanggal_pengadaan?: string | null;
  created_at: string;
  updated_at: string;
  imageUrl?: string;
}
// --- Akhir Tipe Data ---


// --- Definisi Props yang Diperbarui ---
interface ViewItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventarisType | null; // Menggunakan tipe data backend
  // Prop onBorrow menerima 4 argumen
  onBorrow?: (item: InventarisType, quantity: number, returnDate: string, purpose: string) => void;
  canManage?: boolean; // Flag untuk Admin/Aslab
  onDeleteItem?: (id: number) => void; // Fungsi untuk menghapus item
}

const ViewItemDialog: React.FC<ViewItemDialogProps> = ({
  open,
  onOpenChange,
  item,
  onBorrow,
  canManage,
  onDeleteItem,
}) => {
  // State lokal HANYA untuk inputan form borrow di dalam dialog ini
  const [borrowQuantity, setBorrowQuantity] = useState(1);
  const [borrowReturnDate, setBorrowReturnDate] = useState('');
  const [borrowPurpose, setBorrowPurpose] = useState('');
  const [isProcessingBorrow, setIsProcessingBorrow] = useState(false); // State loading spesifik borrow

  // Reset state lokal saat item berubah atau dialog dibuka/tutup
  React.useEffect(() => {
      if (open && item) {
          setBorrowQuantity(1);
          setBorrowReturnDate('');
          setBorrowPurpose('');
          setIsProcessingBorrow(false); // Reset loading borrow
      }
  }, [open, item]);


  if (!item) return null; // Jangan render jika tidak ada item

  // Fungsi yang dipanggil saat tombol Confirm Borrow di klik
  const handleBorrow = async () => {
    if (!borrowReturnDate) {
      toast.error("Please select a return date."); // Gunakan toast untuk error
      return;
    }
     if (!borrowPurpose) {
      toast.error("Please enter the purpose of borrowing.");
      return;
    }

    if (onBorrow && item) {
      setIsProcessingBorrow(true); // Mulai loading borrow
      try {
        // Panggil fungsi onBorrow dari parent (Inventory.tsx)
        // Fungsi onBorrow di parent akan menangani pemanggilan API
        await onBorrow(item, borrowQuantity, borrowReturnDate, borrowPurpose);
        // Jika onBorrow di parent berhasil (tidak throw error), tutup dialog?
        // onOpenChange(false); // Atau biarkan parent yang menutup
      } catch (error) {
        // Error sudah ditangani oleh onBorrow di parent (yang menampilkan toast)
        console.error("Borrow request failed in dialog:", error);
      } finally {
         setIsProcessingBorrow(false); // Selesai loading borrow
      }
    }
  };

  // Fungsi yang dipanggil saat tombol Delete di klik
  const handleDelete = () => {
      if (onDeleteItem && item) {
          onDeleteItem(item.id); // Panggil fungsi delete dari parent
          onOpenChange(false); // Tutup dialog
      }
  }

  const maxBorrowQuantity = item.jumlah; // Jumlah stok saat ini

  // Fungsi helper format tanggal
   const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString.split(' ')[0]);
      return format(date, "PPP"); // Format: Jan 1, 2023
    } catch (e) {
      return dateString;
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          {/* Gunakan properti dari InventarisType */}
          <DialogTitle>Item Details: {item.nama_alat}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2"> {/* Tambah scroll */}
          {/* Kolom Gambar */}
          <div className="md:col-span-1 rounded-lg overflow-hidden bg-muted flex items-center justify-center h-[180px] md:h-auto">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.nama_alat} className="w-full h-full object-cover"/>
            ) : (
              <Package className="h-16 w-16 text-muted-foreground" />
            )}
          </div>

          {/* Kolom Detail */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Gunakan item.kategori?.nama_kategori */}
              {item.kategori && (
                  <Badge variant="secondary">{item.kategori.nama_kategori}</Badge>
              )}
              <div className="text-xs text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {/* Gunakan item.lokasi */}
                {item.lokasi || 'N/A'}
              </div>
            </div>

             {/* Gunakan item.deskripsi */}
            <p className="text-sm text-muted-foreground">{item.deskripsi || 'No description available.'}</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-3">
              <div className="font-medium">Quantity:</div>       <div>{item.jumlah}</div>
              <div className="font-medium">Condition:</div>      <div>{item.kondisi}</div>
              {/* Gunakan item.nomor_seri */}
              <div className="font-medium">Serial Number:</div>  <div>{item.nomor_seri || 'N/A'}</div>
              {/* Gunakan item.tanggal_pengadaan */}
              <div className="font-medium">Purchase Date:</div> <div>{formatDate(item.tanggal_pengadaan)}</div>
              {/* Gunakan item.updated_at */}
              <div className="font-medium">Last Updated:</div>   <div>{formatDate(item.updated_at)}</div>
            </div>

            {/* --- Bagian Borrow (Hanya untuk non-Admin/Aslab jika stok > 0) --- */}
            {!canManage && onBorrow && item.jumlah > 0 && (
              <div className="border-t pt-4 mt-4 space-y-3">
                <h3 className="text-md font-semibold">Borrow This Item</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="borrow-quantity">Quantity</Label>
                        <Input
                            id="borrow-quantity"
                            type="number"
                            min={1}
                            max={maxBorrowQuantity}
                            value={borrowQuantity}
                            onChange={(e) => setBorrowQuantity(Math.min(maxBorrowQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-24"
                            disabled={maxBorrowQuantity <= 0}
                        />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="borrow-return-date">Return Date</Label>
                        <Input
                            id="borrow-return-date"
                            type="date"
                            value={borrowReturnDate}
                            onChange={(e) => setBorrowReturnDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]} // Minimal hari ini
                            required
                         />
                    </div>
                 </div>
                 <div className="space-y-1">
                     <Label htmlFor="borrow-purpose">Purpose</Label>
                     <Input
                        id="borrow-purpose"
                        type="text"
                        placeholder="e.g., Praktikum Kimia Dasar"
                        value={borrowPurpose}
                        onChange={(e) => setBorrowPurpose(e.target.value)}
                        required
                     />
                 </div>
                 {/* Tombol Confirm Borrow */}
                <Button onClick={handleBorrow} disabled={maxBorrowQuantity <= 0 || isProcessingBorrow}>
                   {isProcessingBorrow ? "Requesting..." : "Confirm Borrow Request"}
                </Button>
              </div>
            )}

             {/* Pesan Stok Habis */}
             {!canManage && item.jumlah <= 0 && (
                 <p className="text-sm font-semibold text-red-600 border-t pt-4 mt-4">Out of Stock</p>
             )}

          </div> {/* Akhir Kolom Detail */}
        </div> {/* Akhir Grid Utama Konten */}

        <DialogFooter className="gap-2 sm:justify-between mt-4 pt-4 border-t">
           {/* Tombol Admin/Aslab */}
           {canManage && onDeleteItem && ( // Tampilkan jika bisa manage DAN ada fungsi delete
               <div className="flex gap-2">
                 {/* <Button variant="outline" size="sm"> <Edit className="h-4 w-4 mr-1" /> Edit </Button> */} {/* TODO: Tambah fungsi Edit */}
                 <Button variant="destructive" size="sm" onClick={handleDelete}> <Trash2 className="h-4 w-4 mr-1" /> Delete Item </Button>
               </div>
           )}
            {/* Tombol Close Umum */}
           <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewItemDialog;