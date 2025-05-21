// src/components/laboratories/LabTabsContent.tsx
import React from 'react';
import LabGrid from './LabGrid'; // Asumsi Anda memiliki atau akan membuat LabGrid.tsx
import { Laboratorium } from './types'; // Pastikan path ini benar

// Definisikan props yang diterima oleh LabTabsContent
interface LabTabsContentProps {
  laboratories: Laboratorium[]; // Daftar lab yang akan ditampilkan (sudah difilter)
  isLoading: boolean;          // Status loading utama dari provider
  onLabClick: (lab: Laboratorium) => void; // Fungsi yang dipanggil saat sebuah lab di-klik
}

const LabTabsContent: React.FC<LabTabsContentProps> = ({
  laboratories,
  isLoading,
  onLabClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 min-h-[200px]"> {/* Tambah min-height */}
        <p className="text-gray-500 animate-pulse">Memuat data laboratorium...</p>
        {/* Anda bisa menggantinya dengan komponen Skeleton atau Spinner yang lebih baik */}
      </div>
    );
  }

  // `LabGrid` akan menangani pesan jika `laboratories` kosong.
  // Jika Anda tidak menggunakan LabGrid, Anda bisa menambahkan pengecekan di sini:
  // if (!laboratories || laboratories.length === 0) {
  //   return (
  //     <div className="text-center py-10 min-h-[200px]">
  //       <p className="text-gray-500">Tidak ada laboratorium yang sesuai dengan filter Anda.</p>
  //     </div>
  //   );
  // }

  return (
    // Komponen ini sekarang mendelegasikan tampilan grid ke LabGrid
    // LabGrid akan menerima daftar laboratorium yang sudah siap ditampilkan
    <LabGrid
      labs={laboratories}
      onLabClick={onLabClick}
      // Jika LabGrid memiliki prop untuk pesan kosong, Anda bisa menggunakannya:
      emptyMessage="Tidak ada laboratorium yang ditemukan sesuai filter Anda."
    />
  );
};

export default LabTabsContent;