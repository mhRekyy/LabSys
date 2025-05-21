// src/components/laboratories/LabGrid.tsx
import React from "react";
import { Laboratorium } from "./types"; // GANTI Lab menjadi Laboratorium
import LabCard from "./LabCard";       // Pastikan LabCard juga disesuaikan
import EmptyLabState from "./EmptyLabState"; // Asumsi komponen ini sudah ada

// Definisikan props yang diterima oleh LabGrid
interface LabGridProps {
  labs: Laboratorium[]; // Gunakan tipe Laboratorium
  onLabClick: (lab: Laboratorium) => void; // Kirim seluruh objek lab saat diklik
  emptyMessage?: string;
  // HAPUS onStatusChange dari props
}

const LabGrid: React.FC<LabGridProps> = ({
  labs,
  onLabClick,
  emptyMessage,
  // HAPUS onStatusChange dari parameter destrukturisasi
}) => {
  if (labs.length === 0) {
    // Jika emptyMessage diberikan, gunakan itu. Jika tidak, EmptyLabState mungkin punya default.
    return <EmptyLabState message={emptyMessage || "Tidak ada laboratorium untuk ditampilkan."} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4"> {/* Contoh penambahan xl breakpoint */}
      {labs.map((lab) => (
        <LabCard
          key={lab.id}
          lab={lab} // Kirim objek lab dengan tipe Laboratorium
          onClick={() => onLabClick(lab)} // Pastikan onClick di LabCard menerima fungsi tanpa argumen atau sesuaikan
                                         // Atau jika LabCard menerima lab sebagai argumen di onClick-nya:
                                         // onClick={onLabClick} dan LabCard akan memanggilnya dengan lab
          // HAPUS onStatusChange dari props yang dikirim ke LabCard
        />
      ))}
    </div>
  );
};

export default LabGrid;