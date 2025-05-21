// src/types/dashboard.ts

// Tipe untuk item booking lab individual (sama seperti sebelumnya)
export interface LabBookingItem {
  id: number;
  user_id?: number; // Opsional jika tidak selalu dikirim untuk 'myRecentLabBookings'
  lab_id: number;
  user?: { id: number; name: string }; // Nama user untuk admin view
  lab?: { id: number; name: string };   // Nama lab (di model Anda 'nama_lab')
  start_time: string; // ISO string date
  end_time: string;   // ISO string date
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | string; // Tambahkan string untuk fleksibilitas status lain
  purpose: string;
}

// Tipe untuk data point chart (sama seperti sebelumnya)
export interface ChartDataPoint {
  date: string; // 'YYYY-MM-DD'
  total: number;
}

// Statistik Umum (bisa dikosongkan jika tidak ada yang benar-benar umum)
interface BaseDashboardStats {
  // server_time?: string;
}

// Perbarui AdminAslabDashboardData
export interface AdminAslabDashboardData extends BaseDashboardStats {
  totalUsers: number;
  totalInventarisItems: number;
  totalInventarisUnits: number;
  totalLabs: number;
  labsOpen: number;
  peminjamanAktifTotal: number;
  pendingReturnsTotal: number;
  peminjamanMenungguPersetujuan?: number; // Tambahkan jika ada dari backend

  // Data Riwayat Booking Lab Baru untuk Admin/Aslab
  recentLabBookings?: LabBookingItem[];
  labBookingsPendingApproval?: number;
  labBookingsActiveToday?: number;

  // Data Chart Baru untuk Admin/Aslab
  peminjamanLast7Days?: ChartDataPoint[];
  labBookingsLast7Days?: ChartDataPoint[];
}

// Perbarui MahasiswaDashboardData
export interface MahasiswaDashboardData extends BaseDashboardStats {
  activeBookings: number; // Peminjaman alat aktif saya (sudah ada)
  myPeminjamanMenungguPersetujuan?: number; // Tambahkan jika ada dari backend

  // Tambahan baru untuk mahasiswa
  myRecentLabBookings?: LabBookingItem[];
  myLabBookingsPending?: number;
  myLabBookingsApproved?: number;

  myPeminjamanLast7Days?: ChartDataPoint[];
  myLabBookingsLast7Days?: ChartDataPoint[];
}

// Tipe gabungan untuk data statistik dalam respons API (tetap sama)
export type DashboardApiResponseData = AdminAslabDashboardData | MahasiswaDashboardData;

// Tipe untuk keseluruhan respons API GET /api/dashboard (tetap sama)
export interface ApiDashboardResponse {
  success: boolean;
  message?: string;
  data: DashboardApiResponseData; // Ini adalah data yang akan memiliki salah satu tipe di atas
}

// Tipe DashboardData yang akan digunakan di state komponen DashboardPage.tsx (tetap sama)
export type DashboardData = DashboardApiResponseData;