// src/components/laboratories/LaboratoriesContent.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { Laboratorium, BackendLaboratoriumFilters } from "@/components/laboratories/types";
import { useLabFilters } from "@/components/laboratories/LabFilteringProvider";
import LabTabsContent from "@/components/laboratories/LabTabsContent";
import LaboratoriesHeader from "@/components/laboratories/LaboratoriesHeader";
import { useAuth } from "@/contexts/AuthContext";
import LabFilters from "@/components/laboratories/LabFilters";
import LabDetailsDialog from "./LabDetailsDialog";
import LabBookingDialog from "./LabBookingDialog";
import { FormattedBookingPayload } from "./BookingForm"; // Pastikan tipe ini ada dan diimpor
import axiosInstance from "@/lib/axiosInstance"; // Impor jika Anda akan melakukan API call di sini

const LaboratoriesContent: React.FC = () => {
  const [selectedLabDetail, setSelectedLabDetail] = useState<Laboratorium | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [labToBook, setLabToBook] = useState<Laboratorium | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const {
    displayLaboratories,
    isLoading,
    backendFilters,
    setBackendFilters,
    updateLabStatus,
    fetchLabDetails,
    refreshLaboratories, // Jika Anda menambahkannya di provider
  } = useLabFilters();

  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isAslab, isStudent, user, token, isAuthenticated } = useAuth(); // Ambil isStudent

  // Tentukan hak akses manajemen (Admin atau Aslab)
  const canManageAccess = isAdmin || isAslab;

  // Tentukan apakah role saat ini boleh booking dari dialog ini
  // Sesuai permintaan: Admin dan Aslab boleh, Mahasiswa TIDAK.
  const canBookFromThisDialog = isAdmin || isAslab;

  // Efek untuk membaca filter status dari URL saat mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter") as BackendLaboratoriumFilters['status'] | null;
    if (filterParam && (filterParam === 'Open' || filterParam === 'Closed' || filterParam === '')) {
      if (backendFilters.status !== filterParam) {
        setBackendFilters(prev => ({ ...prev, status: filterParam, search: prev.search }));
      }
    }
  }, [location.search, backendFilters.status, setBackendFilters]);

  const handleViewDetails = useCallback(async (lab: Laboratorium) => {
    console.log("--- LaboratoriesContent: handleViewDetails ---");
    console.log("Lab object received by handleViewDetails:", JSON.stringify(lab, null, 2));
    if (!lab || typeof lab.id !== 'number' || isNaN(lab.id)) {
      toast.error("Gagal membuka detail: Informasi laboratorium tidak lengkap atau ID tidak valid.");
      setIsDetailModalOpen(false); return;
    }
    setSelectedLabDetail(null); setIsDetailLoading(true); setIsDetailModalOpen(true);
    const details = await fetchLabDetails(lab.id);
    if (details) { setSelectedLabDetail(details); }
    setIsDetailLoading(false);
  }, [fetchLabDetails]);

  const handleConfirmStatusChange = async (labId: number, newStatus: "Open" | "Closed") => {
    console.log("LaboratoriesContent: handleConfirmStatusChange called with:", labId, newStatus);
    const success = await updateLabStatus(labId, newStatus);
    if (success) {
      if (selectedLabDetail && selectedLabDetail.id === labId) {
        setSelectedLabDetail(prev => prev ? { ...prev, status: newStatus } : null);
      }
      // Jika updateLabStatus di provider tidak otomatis refresh list, panggil refreshLaboratories
      // refreshLaboratories();
    }
  };

  const handleOpenBookingDialog = (lab: Laboratorium) => {
    if (!isAuthenticated) {
      toast.error("Anda harus login untuk melakukan booking.");
      navigate('/login', { state: { from: location } }); return;
    }
    // Pengecekan tambahan jika hanya role tertentu yang boleh buka dialog booking
    if (!canBookFromThisDialog) { // Menggunakan flag yang sudah kita definisikan
        toast.info("Fitur booking tidak tersedia untuk role Anda dari halaman ini.");
        return;
    }
    setLabToBook(lab);
    setIsDetailModalOpen(false); // Tutup dialog detail jika terbuka
    setIsBookingDialogOpen(true);
  };

  const activeTabValue = useCallback((): string => {
    if (backendFilters.status === 'Open') return 'open';
    return 'all';
  }, [backendFilters.status]);

  const handleTabChange = (tabValue: string) => {
    let newStatus: BackendLaboratoriumFilters['status'] = '';
    if (tabValue === "open") newStatus = 'Open';
    // else if (tabValue === "closed") newStatus = 'Closed'; // Jika ada tab closed

    // Hanya update jika status benar-benar berubah untuk menghindari fetch berlebih
    if (newStatus !== backendFilters.status || tabValue === "all" && backendFilters.status !== '') {
        setBackendFilters(prev => ({ ...prev, search: prev.search, status: newStatus }));
    }

    if (tabValue === "building") {
      toast.info("Tab 'Engineering' adalah contoh. Filter gedung ada di 'Filter Lanjutan'.");
    }
  };

  const handleActualBookingSubmit = async (labId: number, bookingData: FormattedBookingPayload) => {
    if (!token) { toast.error("Sesi tidak valid. Silakan login kembali."); return; }
    console.log("Data Peminjaman yang Akan Dikirim ke API:", { labId_info: labId, ...bookingData });
    const payloadToApi = {
      inventaris_id: bookingData.inventaris_id,
      jumlah_pinjam: bookingData.jumlah_pinjam,
      tanggal_kembali_rencana: bookingData.tanggal_kembali_rencana,
      tujuan_peminjaman: bookingData.tujuan_peminjaman,
    };
    try {
      // // UNCOMMENT KETIKA API BACKEND SIAP
      // const response = await axiosInstance.post('/api/peminjaman', payloadToApi, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // toast.success(response.data.message || "Permintaan peminjaman berhasil diajukan!");
      // navigate("/borrowing-history");

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi
      toast.success("Permintaan peminjaman (simulasi) berhasil diajukan!");
      console.log("Payload ke POST /api/peminjaman:", payloadToApi);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Gagal mengajukan peminjaman.";
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).flat().forEach((errArray: any) => {
            (errArray as string[]).forEach((errMsg: string) => toast.error(errMsg));
        });
      } else { toast.error(errorMessage); }
    } finally {
      setIsBookingDialogOpen(false);
      setLabToBook(null);
    }
  };

  return (
    <>
      <LaboratoriesHeader onAddLab={canManageAccess ? () => { toast.info("Fitur Tambah Lab belum diimplementasikan") } : undefined} />
      <LabFilters />

      <Tabs value={activeTabValue()} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto mb-4">
          <TabsTrigger value="all">Semua Lab</TabsTrigger>
          <TabsTrigger value="open">Sedang Buka</TabsTrigger>
          <TabsTrigger value="building">Engineering</TabsTrigger>
        </TabsList>
        <LabTabsContent
          laboratories={displayLaboratories}
          isLoading={isLoading}
          onLabClick={handleViewDetails}
        />
      </Tabs>

      {isDetailModalOpen && (
        <LabDetailsDialog
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          lab={selectedLabDetail}
          isLoading={isDetailLoading}
          onConfirmStatusChange={handleConfirmStatusChange}
          onBookLab={handleOpenBookingDialog} // Tetap kirim fungsi ini
          canManageAccess={canManageAccess}   // Untuk tombol ubah status
          canBookFromDialog={canBookFromThisDialog} // Untuk tombol booking
        />
      )}

      {labToBook && (
        <LabBookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          selectedLab={labToBook}
          onBookingSubmit={handleActualBookingSubmit}
        />
      )}
    </>
  );
};

export default LaboratoriesContent;