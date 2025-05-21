// src/components/laboratories/LabDetails.tsx
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Hanya yang dipakai
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, InfoIcon, FileText } from "lucide-react"; // Sesuaikan ikon
import { Laboratorium } from "./types"; // GANTI Lab menjadi Laboratorium
// Hapus useAuth jika tombol admin dipindah ke parent

interface LabDetailsProps {
  lab: Laboratorium;
  // Hapus onStatusChange dan onBookLab dari sini, akan ditangani oleh LabDetailsDialog
}

const LabDetails: React.FC<LabDetailsProps> = ({ lab }) => {
  // Tombol dan logika status dipindahkan ke LabDetailsDialog

  return (
    <>
      {/* DialogContent dan DialogFooter akan ada di LabDetailsDialog.tsx */}
      {/* Kita hanya merender bagian dalam dari detail di sini. */}

      <DialogHeader className="mb-6"> {/* Tambah margin bawah */}
        {/* Judul dan badge status bisa ada di parent (LabDetailsDialog) atau di sini */}
        <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">{lab.nama_lab}</DialogTitle>
            <Badge variant={lab.status === "Open" ? "default" : "destructive"}>
              {lab.status}
            </Badge>
        </div>
        <DialogDescription>
          {lab.lokasi_gedung}, {lab.lokasi_ruang}
          {lab.type_lab && ` - Tipe: ${lab.type_lab}`}
        </DialogDescription>
      </DialogHeader>

      {/*
        Tabs "Schedule" dan "Equipment" perlu data dari backend.
        Jika backend tidak mengirimkannya, kita tidak bisa menampilkannya di sini.
        Untuk sekarang, kita fokus pada tab "Information".
      */}
      {/* <Tabs defaultValue="info" className="mt-4"> */}
        {/* <TabsList className="grid w-full grid-cols-1">  Hanya 1 tab untuk sekarang
          <TabsTrigger value="info">Informasi Detail</TabsTrigger>
        </TabsList> */}

        {/* <TabsContent value="info" className="space-y-6 mt-6"> */}
        <div className="space-y-6"> {/* Ganti TabsContent dengan div biasa jika hanya 1 tab */}
          {lab.deskripsi_singkat && (
            <div>
              <h4 className="font-medium mb-2 text-lg flex items-center">
                <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                Deskripsi
              </h4>
              <p className="text-sm text-muted-foreground">{lab.deskripsi_singkat}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h4 className="font-medium mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                Jam Operasional
              </h4>
              <p className="text-sm">{lab.jam_buka || '--:--'} - {lab.jam_tutup || '--:--'}</p>
            </div>

            <div>
              <h4 className="font-medium mb-1 flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Kapasitas
              </h4>
              <p className="text-sm">{lab.kapasitas} orang</p>
            </div>
          </div>

          {lab.fasilitas_utama && (
            <div>
              <h4 className="font-medium mb-2 text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Fasilitas Utama
              </h4>
              <p className="text-sm text-muted-foreground">{lab.fasilitas_utama}</p>
            </div>
          )}

          {/* Bagian yang dihilangkan karena data tidak ada di LaboratoriumResource:
              - Rating
              - Schedule (TabsContent value="schedule")
              - Equipment (TabsContent value="equipment")
              - Lab Assistants
          */}
          <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
            <p>Dibuat pada: {new Date(lab.created_at).toLocaleString()}</p>
            <p>Terakhir diperbarui: {new Date(lab.updated_at).toLocaleString()}</p>
          </div>
        </div>
        {/* </TabsContent> */}
      {/* </Tabs> */}
    </>
  );
};

export default LabDetails;