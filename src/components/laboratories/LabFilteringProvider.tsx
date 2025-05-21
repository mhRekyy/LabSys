// src/components/laboratories/LabFilteringProvider.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
  // useMemo, // Dihapus jika tidak ada filter frontend tambahan yang signifikan
} from "react";
import {
  Laboratorium,
  BackendLaboratoriumFilters, // Ganti nama dari LaboratoriumFilters jika sebelumnya hanya ini
  // FrontendLaboratoriumFilters, // Hapus jika tidak ada filter frontend kompleks
  // LabFilterOptions, // Hapus jika tidak ada filter frontend kompleks
  ApiLaboratoriumDetailResponse, // Untuk detail
  // ApiLaboratoriumListResponse // Untuk list jika backend mengirim struktur berbeda dari array langsung
} from "@/components/laboratories/types";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

interface LabFilterContextType {
  displayLaboratories: Laboratorium[]; // Data yang ditampilkan
  // allFetchedLaboratories: Laboratorium[]; // Hanya jika ada filter frontend signifikan
  // filterOptions: LabFilterOptions; // Hanya jika ada filter frontend signifikan
  isLoading: boolean;
  backendFilters: BackendLaboratoriumFilters;
  setBackendFilters: React.Dispatch<React.SetStateAction<BackendLaboratoriumFilters>>;
  // frontendFilters: FrontendLaboratoriumFilters; // Hanya jika ada filter frontend signifikan
  // setFrontendFilters: React.Dispatch<React.SetStateAction<FrontendLaboratoriumFilters>>; // Hanya jika ada
  updateLabStatus: (labId: number, newStatus: "Open" | "Closed") => Promise<boolean>;
  fetchLabDetails: (labId: number) => Promise<Laboratorium | null>;
  // totalLabs: number; // Jika ada pagination
  refreshLaboratories: () => void; // Fungsi untuk refresh manual
}

const LabFilterContext = createContext<LabFilterContextType | undefined>(undefined);

export const useLabFilters = () => {
  const context = useContext(LabFilterContext);
  if (!context) throw new Error("useLabFilters must be used within a LabFilterProvider");
  return context;
};

interface LabFilterProviderProps {
  children: React.ReactNode;
}

export const LabFilterProvider: React.FC<LabFilterProviderProps> = ({ children }) => {
  const { token, isAuthenticated, user } = useAuth();

  // State utama untuk daftar laboratorium yang akan ditampilkan
  const [displayLaboratories, setDisplayLaboratories] = useState<Laboratorium[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [backendFilters, setBackendFilters] = useState<BackendLaboratoriumFilters>({
    search: "",
    status: "", // '' = all, 'Open', atau 'Closed'
    // Tambahkan page dan per_page jika ada pagination
    // page: 1,
    // per_page: 10,
  });

  // Jika Anda punya filter frontend yang kompleks, state ini akan diperlukan
  // const [frontendFilters, setFrontendFilters] = useState<FrontendLaboratoriumFilters>({ /* ... */ });

  const fetchLaboratoriesAPI = useCallback(async (currentApiFilters: BackendLaboratoriumFilters) => {
    if (!isAuthenticated || !token) {
      setDisplayLaboratories([]); setIsLoading(false); return;
    }
    console.log("PROVIDER - fetchLaboratoriesAPI - Fetching with filters:", currentApiFilters);
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentApiFilters.search) params.append("search", currentApiFilters.search);
      if (currentApiFilters.status) params.append("status", currentApiFilters.status);
      // if (currentApiFilters.page) params.append('page', currentApiFilters.page.toString());
      // if (currentApiFilters.per_page) params.append('per_page', currentApiFilters.per_page.toString());

      const response = await axiosInstance.get(`/api/laboratorium`, { // Asumsi respons adalah array Laboratorium atau { data: Laboratorium[] }
        headers: { Authorization: `Bearer ${token}` }, params,
      });
      console.log("PROVIDER - fetchLaboratoriesAPI - API Response:", response.data);

      // Sesuaikan dengan struktur respons backend untuk list
      // Jika backend mengirim { data: [...], meta: {...} } (umum untuk pagination Laravel Resource Collection)
      if (response.data && Array.isArray(response.data.data)) {
          setDisplayLaboratories(response.data.data as Laboratorium[]);
          // setPaginationInfo(response.data.meta); // Jika ada pagination
      }
      // Jika backend mengirim array Laboratorium langsung
      else if (Array.isArray(response.data)) {
          setDisplayLaboratories(response.data as Laboratorium[]);
      } else {
          console.warn("PROVIDER - fetchLaboratoriesAPI - Unexpected list response structure:", response.data);
          setDisplayLaboratories([]);
          toast.error("Format data daftar laboratorium tidak dikenali.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memuat data laboratorium.");
      setDisplayLaboratories([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) { setDisplayLaboratories([]); setIsLoading(false); return; }
    const handler = setTimeout(() => fetchLaboratoriesAPI(backendFilters), 500); // Debounce
    return () => clearTimeout(handler);
  }, [backendFilters, fetchLaboratoriesAPI, isAuthenticated]);

  const refreshLaboratories = useCallback(() => {
    fetchLaboratoriesAPI(backendFilters);
  }, [fetchLaboratoriesAPI, backendFilters]);


  const fetchLabDetails = async (labId: number): Promise<Laboratorium | null> => {
    if (!token || !isAuthenticated) { toast.error("Anda harus login."); return null; }
    if (typeof labId !== 'number' || isNaN(labId)) {
      toast.error("ID Laboratorium tidak valid."); return null;
    }
    console.log(`PROVIDER - fetchLabDetails - Fetching for labId: ${labId}`);
    try {
      const response = await axiosInstance.get<ApiLaboratoriumDetailResponse>(`/api/laboratorium/${labId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("PROVIDER - fetchLabDetails - API Response:", response.data);
      // Asumsi backend mengirimkan detail dalam field 'data' jika menggunakan Resource tunggal
      if (response.data && response.data.data && typeof response.data.data === 'object' && 'id' in response.data.data) {
        return response.data.data as Laboratorium;
      }
      // Fallback jika backend mengirim objek Laboratorium langsung (jarang untuk Resource tunggal)
      // else if (response.data && 'id' in response.data) {
      //   return response.data as Laboratorium;
      // }
      toast.error("Format detail laboratorium tidak sesuai."); return null;
    } catch (error: any) {
      console.error("PROVIDER - fetchLabDetails - API Error:", error.response?.data || error.message);
      if (error.response?.status === 404) toast.error(`Lab ID ${labId} tidak ditemukan.`);
      else toast.error(error.response?.data?.message || "Gagal memuat detail lab.");
      return null;
    }
  };

  const updateLabStatus = async (labId: number, newStatus: "Open" | "Closed"): Promise<boolean> => {
    if (!token || !isAuthenticated || !user || !(user.role === 'Admin' || user.role === 'Aslab')) {
      toast.error("Aksi tidak diizinkan."); return false;
    }
    console.log(`PROVIDER - updateLabStatus - LabId: ${labId}, NewStatus: ${newStatus}`);
    if (typeof labId !== 'number' || isNaN(labId)) { // Validasi tambahan
        toast.error("Gagal update status: ID Lab tidak valid.");
        return false;
    }
    try {
      await axiosInstance.patch(`/api/laboratorium/${labId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Status laboratorium berhasil diubah menjadi ${newStatus}.`);
      // Update state lokal untuk UI responsif
      setDisplayLaboratories(prev => prev.map(lab => lab.id === labId ? { ...lab, status: newStatus } : lab));
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengubah status lab.");
      return false;
    }
  };

  const contextValue = {
    displayLaboratories,
    isLoading,
    backendFilters,
    setBackendFilters,
    updateLabStatus,
    fetchLabDetails,
    refreshLaboratories,
  };

  return (<LabFilterContext.Provider value={contextValue}>{children}</LabFilterContext.Provider>);
};