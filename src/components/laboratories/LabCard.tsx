// src/components/laboratories/LabCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, BookOpen, Shield, Zap, Info } from "lucide-react"; // Sesuaikan ikon
import { Laboratorium } from "./types"; // GANTI Lab menjadi Laboratorium
import { motion } from "framer-motion";
// Hapus useAuth jika tombol admin di kartu dihilangkan

// Definisikan props yang diterima oleh LabCard
interface LabCardProps {
  lab: Laboratorium;
  onClick: (lab: Laboratorium) => void; // Fungsi yang dipanggil saat kartu diklik
  // HAPUS onStatusChange dari props
}

const LabCard: React.FC<LabCardProps> = ({ lab, onClick }) => {
  // Tombol dan logika status dipindahkan ke LabDetailsDialog

  // Parsing sederhana untuk jam, bisa diperbaiki atau jam dikirim terpisah dari backend
  const displayHours = (lab.jam_buka && lab.jam_tutup)
    ? `${lab.jam_buka} - ${lab.jam_tutup}`
    : "Tidak tersedia";

  // Ambil info lantai dari lokasi_ruang (contoh sederhana, mungkin perlu disesuaikan)
  const getFloorInfo = (lokasiRuang: string | null): string | null => {
    if (!lokasiRuang) return null;
    const match = lokasiRuang.match(/Lantai\s*(\d+)/i);
    return match ? `Lt. ${match[1]}` : null;
  };
  const floorInfo = getFloorInfo(lab.lokasi_ruang);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full" // Pastikan motion.div mengisi tinggi jika Card juga h-full
    >
      <Card
        className="h-full flex flex-col cursor-pointer hover:border-primary/80 transition-all shadow-sm hover:shadow-md"
        onClick={() => onClick(lab)} // Memanggil onClick dengan objek lab
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onClick(lab)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <CardTitle className="text-lg leading-tight font-semibold text-primary">{lab.nama_lab}</CardTitle>
              <CardDescription className="text-xs">
                {lab.lokasi_gedung}
                {floorInfo && `, ${floorInfo}`}
                {lab.lokasi_ruang && !floorInfo && `, ${lab.lokasi_ruang}`}
              </CardDescription>
            </div>
            <Badge variant={lab.status === "Open" ? "default" : "destructive"} className="whitespace-nowrap">
              {lab.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-2 text-sm">
          {lab.deskripsi_singkat && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {lab.deskripsi_singkat}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Jam: {displayHours}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Kapasitas: {lab.kapasitas} orang</span>
          </div>
          {lab.type_lab && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>Tipe: {lab.type_lab}</span>
            </div>
          )}

          {/* Bagian Fasilitas Utama (sebelumnya equipment) */}
          {lab.fasilitas_utama && (
             <div className="mt-2 pt-2 border-t border-border">
                <h4 className="text-xs font-medium mb-1 text-foreground">Fasilitas Utama:</h4>
                <div className="flex flex-wrap gap-1">
                    {lab.fasilitas_utama.split(',').slice(0, 3).map((item, index) => ( // Ambil 3 fasilitas pertama
                    <Badge variant="secondary" key={index} className="text-xs font-normal">
                        {item.trim()}
                    </Badge>
                    ))}
                    {lab.fasilitas_utama.split(',').length > 3 && (
                    <Badge variant="outline" className="text-xs font-normal">
                        +{lab.fasilitas_utama.split(',').length - 3} lainnya
                    </Badge>
                    )}
                </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3">
          {/* Tombol Details sekarang adalah keseluruhan kartu yang bisa diklik */}
          {/* Jika ingin tombol eksplisit, bisa ditambahkan di sini */}
          {/* <Button variant="outline" size="sm" className="w-full gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            Lihat Detail
          </Button> */}
          <span className="text-xs text-muted-foreground w-full text-center">
            Klik untuk detail
          </span>
          {/* HAPUS tombol Admin untuk Open/Close dari sini */}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LabCard;